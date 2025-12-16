
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
        message: "Tài khoản đã tồn tại!"
    },
    {
        code: 22023,
        message: "Invalid salt"
    },
    {
        code: "PGRST203",
        message: "Lỗi đặt tên trong functions"
    },
    {
        code:'22P02',
        message: "sai dữ liệu"
    }
]

export const authErrorApp = () : AuthErrorApp[] => {
    return authErrorCode
}