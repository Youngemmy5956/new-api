import jwt from "jsonwebtoken"

const config = process.env.JWT_SECRECT_KEY ;

const verifyToken = (req, res, next) => {
    const token =  req.cookies.jwt;

    if(token){
        try {
           jwt.verify(token, config, (err) => {
                if(err){ return res.status(401).json({message: "Invalid token"});
           }else{
            next();
              } 
            });
        } catch (error) {
            return res.status(401).json({message: "Invalid token"});
        }
    }else{
        return res.status(401).json({message: "You need to Login"});
    }
}

export default verifyToken;



//     if(!token) return res.status(401).json({message: "You need to Login"});

//     jwt.verify(token, config, (err, decodedToken) => {
//         if(err) return res.status(401).json({message: "Invalid token"});

//         req.user = decodedToken;

//         next();
//     }
//     )
// }
