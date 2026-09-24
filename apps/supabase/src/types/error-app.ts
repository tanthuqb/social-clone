
interface AuthErrorApp {
    code: number|string;
    message: string;
}

/**
 * Array contains error of app
 */
const authErrorCode: AuthErrorApp[] = [
    {
        code: 422,
        message: "Account already exists!"
    },
    {
        code: 22023,
        message: "Invalid salt"
    },
    {
        code: "PGRST203",
        message: "Function naming error"
    },
    {
        code:'22P02',
        message: "Invalid data"
    }
]

export const authErrorApp = () : AuthErrorApp[] => {
    return authErrorCode
}