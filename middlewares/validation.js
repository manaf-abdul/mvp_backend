import { check } from "express-validator";
export const auth = (method) => {
    switch (method) {
        case "login": {
            return [
              check("email", "Email is required.").isEmail(),
              check("password", "Password is required.").not().isEmpty().isLength({ min: 6 }),
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
    }
}
export const user = (method) => {
    switch (method) {
        case "profileUpdate": {
            return [
                check("name", "Name is required.").not().isEmpty(),
                check("contactNumber", "Contact number is required.").not().isEmpty(),
                check("dob", "Date of birth is required.").not().isEmpty(),
                check("linkedInProfile", "LinkedIn profile is required.").not().isEmpty(),
                check("currentCity", "Current city is required.").not().isEmpty(),
                check("about", "About field is required.").not().isEmpty(),
                check("currentOrganization", "Current organization is required.").not().isEmpty(),
                check("department", "Department field is required.").not().isEmpty(),
                check("skills", "Skills field is required.").not().isEmpty(),
                check("keywords", "Keywords field is required.").not().isEmpty(),
                check("userEmail", "User email is required.").not().isEmpty(),
            ]
        }
    }
}
  