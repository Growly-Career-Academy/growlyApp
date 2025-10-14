// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useMemo } from "react";
// import Button from "@/components/Button";
// import PassInput from "@/components/inputs/PassInput";
// import NumInput from "@/components/inputs/NumInput";

// export default function SignupPasswordPage() {
//   const router = useRouter();
//   const search = useSearchParams();

//   const initialPhone = useMemo(() => search.get("phone") || "", [search]);

//   const [phone, setPhone] = useState(initialPhone);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   function handleSubmit(e) {
//     e.preventDefault();
//     if (!phone || !password || !confirmPassword) return;
//     if (password !== confirmPassword) {
//       alert("رمز عبور و تایید آن یکسان نیستند");
//       return;
//     }

//     // TODO: API برای تکمیل ثبت نام
//     console.log("Completing signup for:", phone, "Password:", password);
//     router.push("/domain");
//   }

//   return (
//     <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
//       <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
//         <div className="text-center mb-8">
//           <h1 className="text-xl font-bold text-gray-800 mb-2">
//             رمز عبور خودت رو انتخاب کن
//           </h1>
//         </div>

//         <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
//           <NumInput
//             value={phone}
//             onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
//             onEdit={() => router.push("/login")}
//           />

//           <PassInput
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//           />

//           <div className="space-y-2 mr-2">
//             <div className="flex items-center gap-2 text-xs text-foreground">
//               <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
//               <span>شامل عدد</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-foreground">
//               <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
//               <span>حداقل ۸ حرف</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-foreground">
//               <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
//               <span>شامل یک حرف بزرگ و کوچک</span>
//             </div>
//           </div>
//           <Button type="submit">ورود</Button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import Button from "@/components/Button";
import PassInput from "@/components/inputs/PassInput";
import NumInput from "@/components/inputs/NumInput";

export default function SignupPasswordPage() {
  const router = useRouter();
  const search = useSearchParams();

  // دریافت شماره موبایل از URL
  const initialPhone = useMemo(() => search.get("phone") || "", [search]);

  // state ها
  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!phone || !password) return;


    // TODO: API برای تکمیل ثبت نام
    console.log("Completing signup for:", phone, "Password:", password);

    // بعد از موفقیت، به داشبورد می‌رویم
    router.push("/Domain");
  }

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            رمز عبور خودت رو انتخاب کن
          </h1>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* شماره موبایل به صورت پر شده از همون اول */}
          <NumInput
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            onEdit={() => router.push("/login")}
          />

          <PassInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <div className="space-y-2 mr-2">
            <div className="flex items-center gap-2 text-xs text-foreground">
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>شامل عدد</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>حداقل ۸ حرف</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>شامل یک حرف بزرگ و کوچک</span>
            </div>
          </div>
          <Button type="submit">ورود</Button>
        </form>
      </div>
    </div>
  );
}
