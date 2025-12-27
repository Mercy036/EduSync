import { sendVerification } from "@/src/helpers/sendVerificationEmails";
import dbConnect from "@/src/lib/dbConnect";
import { UserModel } from "@/src/model/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email_id, password } = await request.json();
    const existingUserVerifyByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifyByUsername) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }
    const existingUserByemail = await UserModel.findOne({ email_id });

    const verifyCode = Math.floor(
      10000000 + Math.random() * 9000000
    ).toString();

    if (existingUserByemail) {
      if (existingUserByemail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByemail.password = hashedPassword;
      existingUserByemail.verifyCode = verifyCode;
      existingUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000);
      await existingUserByemail.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600000);

      const newUser = new UserModel({
        username,
        email_id,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }
    const emailResponse = await sendVerification(
      email_id,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Verification email sent",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    success: true,
    message: "Hello from GET API",
  });
}
