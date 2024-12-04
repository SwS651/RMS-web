import { AuthProvider } from "@refinedev/core";
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, User, GoogleAuthProvider, linkWithCredential, EmailAuthProvider, updatePassword, fetchSignInMethodsForEmail, createUserWithEmailAndPassword, linkWithPopup, reauthenticateWithPopup, reauthenticateWithCredential, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

import { message } from "antd";


import { getAuth } from "firebase/auth";

//Extend AuthProvider with a Custom Type (As React Core does not exist Sign Up method)
interface CustomAuthBindings extends AuthProvider {
    signup?: (params: { email: string; password: string; name?: string }) => Promise<{
      success: boolean;
      redirectTo?: string;
      error?: { name: string; message: string };
    }>;
  }
  
export const authProvider: AuthProvider = {
    login: async ({ email, password, providerName ,isSignUp = false}) => {
        try {
            if (providerName === "google") {
                const auth = getAuth()
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                if(user){

                    const signInMethods = await fetchSignInMethodsForEmail(auth, user.email!);
                    
                    if (signInMethods.length > 0 && !signInMethods.includes("google.com")) {
                        // If the email already exists with email/password, link the Google account
                        const emailCredential = EmailAuthProvider.credential(user.email!, password || "");
                        await linkWithCredential(user, emailCredential);
                    }
  
                    return {
                        success: true,
                        redirectTo: "/",
                    };
                } 
               
            }

             if (email && password) {

                if (isSignUp) {
                    // Handle email/password signup
                    await createUserWithEmailAndPassword(auth, email, password);

                } else {
                    // Handle email/password login
                    await signInWithEmailAndPassword(auth, email, password);
                }
                return {
                    success: true,
                    redirectTo: "/",
                };
            }

            return {
                success: false,
                error: {
                    message: "Login Error",
                    name: "Invalid email or password",
                },
            };
        } catch (error: any) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                // Handle case where the user tries to sign in with a different provider
                return {
                    success: false,
                    error: {
                        message: "Account exists with a different provider. Please use the correct sign-in method.",
                        name: "Account Exists",
                    },
                };
            }

            return {
                success: false,
                error: {
                    message: error.message,
                    name: "Login Error",
                },
            };
        }
    },
    register:async({ email, password, name="" })=>{
        try {
            const authSignUp = await getAuth();
            const result = await createUserWithEmailAndPassword(authSignUp, email, password);
      
            if (name) {
                await updateProfile(result.user, { displayName: name });
            }
      
            localStorage.setItem("auth", JSON.stringify(result.user));
            return { 
                success: true,
                successNotification: {
                    message: "Registration Successful",
                    description: "You have successfully registered.",
                },
                redirectTo: "/login" 
            };
        } catch (error: any) {
            console.error("Sign-Up Error:", error);

            if (error.code === "auth/email-already-in-use") {
                return {
                  success: false,
                  error: {
                    name: "Email Already Exists",
                    message: "This email is already in use. Please try logging in.",
                  },
                };
              }
            return {
              success: false,
              error: {
                name: "Sign-Up Error",
                message: error.message || "An error occurred during sign-up",
              },
            };
          }
    },
    
    logout: async () => {
        try {
            await signOut(auth);
            return {
                success: true,
                redirectTo: "/login",
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    message: error.message,
                    name: "Logout Error",
                },
            };
        }
    },

    onError: async (error) => {
        console.error(error);
        return { error };
    },

    check: async () => {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve({
                        authenticated: true,
                    });
                } else {
                    resolve({
                        authenticated: false,
                        redirectTo: "/login",
                        error: {
                            message: "Authentication required",
                            name: "Unauthorized",
                        },
                    });
                }
            });
        });
    },
    getIdentity: async () => {
        const user = auth.currentUser;

        if (user) {
            const { uid, displayName, email, photoURL } = user;
            return {
                id: uid,
                name: displayName || email,
                email: email,
                avatar: photoURL,
            };
        }

        return null;
    },

    getPermissions: async () => {
        // You can implement role-based permissions here
        return null;
    },

    updatePassword: async ({password,confirmPassword,currentPassword="",newPassword="",isGoogle=false})=>{
        try {
            const user = auth.currentUser as User;
            if (isGoogle){
 
                if (user) {
                    // Re-authenticate user with current password before updating
                    // const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);
                    // await reauthenticateWithCredential(user, credential).then(()=>{
                        const provider = new GoogleAuthProvider();
            
                        // Re-authenticate the user with Google
                        await reauthenticateWithPopup(user, provider);
                        await updatePassword(user, confirmPassword)
                    // });
                    
                    return {
                        success: true,
                        message: "Password has been changed",
                        name:'Updated Password',
                        redirectTo: "/", // Redirect to update password page
                    };
                }
            }else{
                const credential = EmailAuthProvider.credential(user.email!, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user,newPassword)
                return {
                    success: true,
                    message: "Password has been changed",
                    name:'Updated Password',
                    redirectTo: "/", // Redirect to update password page
                };
            }
            return {
                success: false,
                error: {
                    name: "Update Password Error",
                    message: "Unable to update password",
                  },
            };

        } catch (error:any) {
            message.error(error.message || "Failed to update password.");
            return {
                success: false,
                error: {
                    name: "Update Password Error",
                    message: error.message
                  },
            };
        }
        
    }
    ,

    forgotPassword: async ({ email }) => {
        // You can handle the reset password process according to your needs.
    
        // If the process is successful.
        return {
          success: true,
        };
    
        return {
          success: false,
          error: {
            name: "Register Error",
            message: "Invalid email",
          },
        };
      },
  };
  
