import { check } from "express-validator";
export const auth = (method) => {
    switch (method) {
        case "login": {
            return [
              check("email", "Email is required.").isEmail(),
              check("password", "Password is required.").not().isEmpty(),
            ];
        }
        case "register": {
            return [
                check("email", "Email is required.").isEmail(),
                check("name", "Name is required.").not().isEmpty(),
                check("password", "Password is required.").not().isEmpty().isLength({ min: 6 }),
                check("confirmPassword", "Passwords do not match.").custom((value, { req }) => value === req.body.password)
            ]
        }
        case "verifyOtp": {
            return [
                check("email", "Email is required.").isEmail(),
                check("otp", "OTP is required.").not().isEmpty(),
            ]
        }
        case "forgetPassword": {
            return [
                check("email", "Email is required.").isEmail(),
                check("otp", "New password is required.").not().isEmpty(),
                check("newPassword", "Password is required.").not().isEmpty(),
                check("confirmPassword", "Passwords do not match.").custom((value, { req }) => value === req.body.password)
            ]
        }
        case "changePassword": {
            return [
                check("otp", "New password is required.").not().isEmpty(),
                check("newPassword", "Password is required.").not().isEmpty(),
                check("confirmPassword", "Passwords do not match.").custom((value, { req }) => value === req.body.password),
            ]
        }
    }
}
export const user = (method) => {
    switch (method) {
        case "profileUpdate": {
            return [
                check("firstName", "First name is required.").not().isEmpty(),
                check("lastName", "Last name is required.").not().isEmpty(),
                check("userName", "").optional(),
                check("contactNumber", "Contact number is required.").optional().isNumeric(),
                check("dob", "Date of birth is required.").not().isEmpty(),
                check("linkedInProfile", "LinkedIn profile is required.").not().isEmpty(),
                check("city", "Current city is required.").not().isEmpty(),
                check("about", "About field is required.").not().isEmpty(),
                check("organization", "Current organization is required.").not().isEmpty(),
                check("role", "Role is required.").not().isEmpty(),
                check("department", "Department field is required.").not().isEmpty(),
                check("skills", "Skills field is required.").not().isEmpty(),
                check("abilities", "Keywords field is required.").not().isEmpty(),
                check("seeking", "Seeking field is required").not().isEmpty(),
                check("profilePic", "").optional()
            ]
        }
    }
}
