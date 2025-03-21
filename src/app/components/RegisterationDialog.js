// // "use client"

// // import { useState } from "react"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// // import { Input } from "@/components/ui/input"
// // import { Button } from "@/components/ui/button"
// // import { toast } from "sonner"
// // import { Eye, EyeOff, Loader } from "lucide-react"
// // import { useDispatch } from "react-redux"
// // import { setUserDetails } from "@/store/UserSlice"

// // export function RegistrationDialog({ open, onClose, email }) {
// //   const dispatch = useDispatch()
// //   const [name, setName] = useState("")
// //   const [address, setAddress] = useState("")
// //   const [phoneNo, setPhoneNo] = useState("")
// //   const [password, setPassword] = useState("")
// //   const [loadingAction, setLoadingAction] = useState(null)
// //   const [showPassword, setShowPassword] = useState(false)

// //   const handleSubmit = async () => {
// //     if (!password) {
// //       toast.error("Please fill in all fields")
// //       return
// //     }

// //     const payload = { email, name, password }

// //     try {
// //       setLoadingAction("register")
// //       const response = await fetch(`/api/user/register`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(payload),
// //       })

// //       const result = await response.json()
// //       if (result.success) {
// //         toast.success("User registered successfully")
// //         dispatch(setUserDetails(result.data));
// //         console.log('Data saved to Redux');
// //         onClose()
// //         window.location.replace('/');
// //       } else {
// //         toast.error(result.message)
// //       }
// //     } catch (error) {
// //       console.error("Error submitting registration:", error)
// //       toast.error("An error occurred during registration")
// //     } finally {
// //       setLoadingAction(null)
// //     }
// //   }

// //   return (
// //     <Dialog open={open} onOpenChange={onClose}>
// //       <DialogContent className="max-w-xs md:max-w-sm p-4">
// //         <DialogHeader>
// //           <DialogTitle className="text-2xl">Registration</DialogTitle>
// //         </DialogHeader>
// //         <div className="flex flex-col gap-4 text-xl">
// //           <Input
// //             type="text"
// //             placeholder="Name"
// //             value={name}
// //             className="rounded-none p-4"
// //             onChange={(e) => setName(e.target.value)}
// //           />
// //           <Input
// //             type="text"
// //             placeholder="Last Name"
// //             value={name}
// //             className="rounded-none p-4"
// //             onChange={(e) => setName(e.target.value)}
// //           />
// //           <Input type="email" value={email} disabled className="rounded-none p-4" placeholder="Email" />
// //           <div className="relative">
// //             <Input
// //               type={showPassword ? "text" : "password"}
// //               placeholder="Password"
// //               value={password}
// //               className="rounded-none p-4"
// //               onChange={(e) => setPassword(e.target.value)}
// //             />
// //             <button
// //               type="button"
// //               onClick={() => setShowPassword(!showPassword)}
// //               className="absolute right-2 top-1/2 transform -translate-y-1/2"
// //             >
// //               {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
// //             </button>
// //           </div>
// //           <Button
// //             className="w-full bg-black text-white rounded-none p-4"
// //             onClick={handleSubmit}
// //             disabled={loadingAction === "register"}
// //           >
// //             {loadingAction === "register" ? <Loader className="animate-spin" /> : "Register"}
// //           </Button>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }


// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { toast } from "sonner"
// import { Eye, EyeOff, Loader, Check } from "lucide-react"
// import { useDispatch } from "react-redux"
// import { setUserDetails } from "@/store/UserSlice"

// export function RegistrationDialog({ open, onClose, email }) {
//   const dispatch = useDispatch()
//   const [firstName, setFirstName] = useState("")
//   const [lastName, setLastName] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [loadingAction, setLoadingAction] = useState(null)
//   const [agreed, setAgreed] = useState(false)

//   const isPasswordValid = password.length >= 12;

//   const handleSubmit = async () => {
//     if (!firstName || !lastName || !password || !agreed) {
//       toast.error("Please fill in all fields and agree to the terms")
//       return
//     }

//     if (!isPasswordValid) {
//       toast.error("Password must be at least 12 characters")
//       return
//     }

//     const payload = { email, firstName, lastName, password }

//     try {
//       setLoadingAction("register")
//       const response = await fetch(`/api/user/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       })

//       const result = await response.json()
//       if (result.success) {
//         toast.success("User registered successfully")
//         dispatch(setUserDetails(result.data));
//         onClose()
//         window.location.replace('/')
//       } else {
//         toast.error(result.message)
//       }
//     } catch (error) {
//       console.error("Error submitting registration:", error)
//       toast.error("An error occurred during registration")
//     } finally {
//       setLoadingAction(null)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-xs md:max-w-sm p-6 bg-white rounded-lg shadow-lg">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold text-center">Sign Up</DialogTitle>
//         </DialogHeader>
//         <div className="flex flex-col gap-4 text-lg">
//           <div className="relative">
//             <Input
//               type="text"
//               placeholder="First name"
//               value={firstName}
//               className="rounded-md p-4 bg-green-100"
//               onChange={(e) => setFirstName(e.target.value)}
//             />
//             {firstName && <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600" />}
//           </div>
//           <div className="relative">
//             <Input
//               type="text"
//               placeholder="Last name"
//               value={lastName}
//               className="rounded-md p-4 bg-green-100"
//               onChange={(e) => setLastName(e.target.value)}
//             />
//             {lastName && <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600" />}
//           </div>
//           <div className="relative">
//             <Input type="email" value={email} disabled className="rounded-md p-4 bg-green-100" placeholder="Email" />
//             <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600" />
//           </div>
//           <div className="relative">
//             <Input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               className={`rounded-md p-4 ${isPasswordValid ? 'bg-green-100' : 'bg-light-100'}`}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-10 top-1/2 transform -translate-y-1/2"
//             >
//               {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//             </button>
//             {isPasswordValid && <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600" />}
//           </div>
//           <p className="text-sm text-gray-600">• Must be at least 12 characters</p>
//           <div className="flex items-center gap-2">
//             <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
//             <span className="text-sm">I agree to SBX Cars's <a href="#" className="text-blue-600 underline">Terms of Service</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>.</span>
//           </div>
//           <Button
//             className="w-full bg-yellow-600 text-white rounded-md p-4"
//             onClick={handleSubmit}
//             disabled={loadingAction === "register"}
//           >
//             {loadingAction === "register" ? <Loader className="animate-spin" /> : "Create account"}
//           </Button>
//           <p className="text-center text-sm">
//             <a href="#" className="text-black font-semibold">Log in here</a>
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Check, Eye, EyeOff, Loader } from "lucide-react"
import { useDispatch } from "react-redux"
import { setUserDetails } from "@/store/UserSlice"

export function RegistrationDialog({ open, onClose, email }) {
  const dispatch = useDispatch()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loadingAction, setLoadingAction] = useState(null)
  const [agree, setAgree] = useState(false)

  const isValid = (value) => value.length >= 3
  const isPasswordValid = password.length >= 12
  const isFormValid = isValid(firstName) && isValid(lastName) && isPasswordValid && agree

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all fields correctly")
      return
    }

    const payload = { email, name:firstName+" "+lastName, password }

    try {
      setLoadingAction("register")
      const response = await fetch(`/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("User registered successfully")
        dispatch(setUserDetails(result.data))
        onClose()
        window.location.replace('/')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Error submitting registration:", error)
      toast.error("An error occurred during registration")
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs md:max-w-sm p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sign Up</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-xl">
          {[{ label: "First Name", value: firstName, setter: setFirstName },
          { label: "Last Name", value: lastName, setter: setLastName }].map(({ label, value, setter }) => (
            <div key={label} className="relative">
              <Input
                type="text"
                placeholder={label}
                value={value}
                style={{color:"#5f924a"}}
                className={`rounded-none px-4 py-6 ${isValid(value) ? 'bg-green-100' : 'bg-white'}`}
                onChange={(e) => setter(e.target.value)}
              />
              {isValid(value) && <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />}
            </div>
          ))}

          <div className="relative">
            <Input type="email" style={{color:'#5f924a'}} value={email} disabled className="rounded-none px-4 py-6 bg-green-100" placeholder="Email" />
            <Check className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />
          </div>


          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              style={{color:"#5f924a"}}

              className={`rounded-none px-4 py-6 ${isPasswordValid ? 'bg-green-100' : 'bg-white'}`}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            {isPasswordValid && <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500" />}
          </div>

          <div className="d-flex align-items-center gap-2">
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
            <small>I agree to SBX Cars's <a href="#" className="underline ms-2" style={{fontSize:"15px"}}>Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.</small>
          </div>

          <Button
            className="w-full bg-black text-white rounded-none px-4 py-6"
            onClick={handleSubmit}
            disabled={!isFormValid || loadingAction === "register"}
          >
            {loadingAction === "register" ? <Loader className="animate-spin" /> : "Create account"}
          </Button>

          <p className="text-center text-sm mt-2">
            <a href="/login" className="text-decoration-none fw-bold">Log in here</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
