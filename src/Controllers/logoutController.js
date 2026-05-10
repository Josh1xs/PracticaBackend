const logoutController = {}

logoutController.logOut = async (req, res) => {

    res.clearCookie("authCookie")

    return res.status(200).json({message: "Logout"})
}

export default logoutController