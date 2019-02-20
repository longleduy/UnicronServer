import {HOST,SERVER_PORT} from '../../utils/contants/host_contants'
export const htmlSignUpVerify = (urlEndPoint,email) => {
    return `<html>

    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Page Title</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    
    <body style="font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;font-size: 16px">
        <div style="width: 100%; text-align: center">
            <label style="width: 100%;text-align: center;color: #ff3b00;font-size: 2em;font-weight: bold;">Unicron Sercure</label>
            <div style="width: 80%;margin:10px auto;">
                <div style="text-align: center;width: 40%;float: left;">
                    <img style="width: 60%;" src="https://res.cloudinary.com/seatechit/image/upload/v1550111223/sign-in.png" />
                </div>
                <div style="width: 50%;float: left;text-align: left;">
                    <label style="font-weight: bold;display: block;margin: 15px 0px;">Hi! ${email}</label>
                    <label>Thanks for sign up! We just need you verify your email address to complete setting up your
                        account</label>
                    <!--  -->
                    <a href='${HOST}:${SERVER_PORT}/graphql/?query={verifyEmail(secretKey: "${urlEndPoint}"){status}}' style="text-decoration: unset;"><input type="button" style="display: block; margin-top: 50px;font-family: 'Latos' !important;    padding: 8px;
                    background-color: #ff3b00;
                        border: none;
                        border-radius: 3px;
                        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12);
                        color: white;
                        font-size:14px;
                        font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;"
                            value="Verify email address" /></a>
                </div>
            </div>
        </div>
    </body>
    
    </html>`
}
export const htmlChangePassWordConfirm = (data) => {
    return `<html>

    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Page Title</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="font-family: Tahoma;">
        <div style="    width: 45%;
        background-color: #627898;
        min-height: 315px;
        margin: 0 auto;
        text-align: center;">
        <label style="font-weight: bold;
        padding-top: 20px;
        display: block;
        font-size: 20px;
        color: white;">React & NodeJs Application</label>
        <p style="margin-top: 60px;
        padding-right: 15px;
        padding-left: 15px;
        color: white;font-size:15px;">We recevied a request to reset your pass word to your React & NodeJs Application accounts
        . To reset your pass word, please click the button below.
        </p>
        <label style="display: block;color: white">Reset time: ${data.currentDate}</label>
        <label style="display: block;margin: 20px 0px;color: #00e200;font-size: 15px;">If you did not request a password reset, please ignore this-email</label>
            <a href="http://localhost:8000/user/confirm/:${data.keyEndcoded}" style="text-align: center;text-align: center;
            text-decoration: none;
            background-color: white;
            display: inline-block;
            padding: 11px 31px;
            font-weight: bold;
            color: #627898;
            border-radius: 3px;box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);">Reset</a>
        </div>
    </body>
    </html>`
}
export const htmlResetPasswordKey = (data) => {
    return `
    <html>
    
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Page Title</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    
    <body style="font-family: Tahoma;">
        <div style="    width: 45%;
            background-color: #627898;
            min-height: 315px;
            margin: 0 auto;
            text-align: center;">
            <label style="font-weight: bold;
            padding-top: 20px;
            display: block;
            font-size: 20px;
            color: white;">React & NodeJs Application</label>
            <p style="margin-top: 60px;
            padding-right: 15px;
            padding-left: 15px;
            color: white;font-size:15px;">We recevied a request to reset your pass word to your React & NodeJs Application accounts .Use this key to reset your pass word
            </p>
            <label style="display: block;margin: 20px 0px;color: #00e200;font-size: 15px;">If you did not request a password reset, please ignore this-email</label>
            <label style="font-weight:  bold;padding-top: 22px;width:  100%;float:  left;font-size: 30px;color:  white">${data}</label>
        </div>
    </body>
    
    </html>`
}