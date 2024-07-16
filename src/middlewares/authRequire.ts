import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '@/src/database/models/user.model';
interface CustomRequest extends Request {
  user?: any; // Define a more specific type if you have a User type
}

// Middleware to authorize user
export const authorizeUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  // Check for the "token" cookie
  const tokenFromCookie = req.cookies?.token;
  // console.log("token="+tokenFromCookie)
  // Check for token in Authorization header with the "Bearer" prefix
  const tokenFromHeader = req.headers.authorization
    ? req.headers.authorization.replace('Bearer ', '')
    : null;
  // console.log(tokenFromHeader)

  const token = tokenFromCookie || tokenFromHeader;
  // const token = tokenFromCookie ;
  if (!token) {
    return res.status(401).json({ error: 'Authentication token not found' });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET!) as jwt.JwtPayload;
    // console.log(decodedToken)
    req.user = await UserModel.findById(decodedToken._id).exec();
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    next(); // Continue to the next middleware or route
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to authorize roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: `Role (${req.user?.role}) is not allowed to access` });
      }
      next();
    } catch (err: any) {
      res.status(403).json({ error: err.message });
    }
  };
};



















// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import { UserModel } from '../users/user';


// interface CustomRequest extends Request {
//   user?: any; // Define a more specific type if you have a User type
// }

// // Middleware to authorize user
// export const authorizeUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
//   // Check for the "token" cookie
//   const tokenFromCookie = req.cookies.token;

//   // Check for token in Authorization header with the "Bearer" prefix
//   const tokenFromHeader = req.headers.authorization
//     ? req.headers.authorization.replace('Bearer ', '')
//     : null;

//   const token = tokenFromCookie || tokenFromHeader;
//   if (!token) {
//     return res.status(401).json({ error: 'Authentication token not found in cookie' });
//   }
//   try {
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
//     req.user = await UserModel.findById(decodedToken.id);
//     next(); // Continue to the next middleware or route
//   } catch (error) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// // Middleware to authorize roles
// export const authorizeRoles = (...roles: string[]) => {
//   return async (req: CustomRequest, res: Response, next: NextFunction) => {
//     try {
//       if (!req.user || !roles.includes(req.user.role)) {
//         throw new Error(`Role (${req.user?.role}) is not allowed to access`);
//       }
//       next();
//     } catch (err: any) {
//       res.status(403).json({ error: err.message });
//     }
//   };
// };
