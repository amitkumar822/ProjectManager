import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, LogIn, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/redux/features/api/userApi";
import { useAppDispatch } from "@/redux/app/reduxHook";
import { userLoggedIn } from "@/redux/features/authSlice";
import type { User } from "@/types/userTypes";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/apiError";
import { useNavigate } from "react-router";

const authSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type AuthSchema = z.infer<typeof authSchema>;

export function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [tab, setTab] = useState<"login" | "register">("login");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  });

  useEffect(() => {
    reset();
  }, [tab, reset]);

  // Mutations
  const [registerUser, regState] = useRegisterUserMutation();
  const [loginUser, logState] = useLoginUserMutation();

  const onSubmit = async (formData: AuthSchema, mode: "login" | "register") => {
    if (mode === "login") {
      await loginUser(formData);
      return;
    } else {
      await registerUser(formData);
      return;
    }
  };

  // Handle login effect
  useEffect(() => {
    if (logState.isSuccess && logState.data?.data) {
      const user = logState.data.data as User;
      dispatch(userLoggedIn({ user }));
      toast.success(logState.data.message || "User Login Successful");
      navigate("/dashboard")
    } else if (logState.error) {
      toast.error(extractErrorMessage(logState.error) || "User Login Failed");
    }
  }, [logState.isSuccess, logState.data, logState.error, dispatch]);

  // Handle register effect
  useEffect(() => {
    if (regState.isSuccess) {
      toast.success(regState.data.message || "User Register Successful");
    } else if (regState.error) {
      toast.error(
        extractErrorMessage(regState.error) || "User Register Failed"
      );
    }
  }, [regState.isSuccess, regState.error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 via-sky-300 to-emerald-300 px-4 py-10">
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <Tabs
          value={tab}
          onValueChange={(val) => {
            setTab(val as any);
          }}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 bg-white/30 rounded-full mb-6 p-1 pb-[42px]  shadow-inner">
            <TabsTrigger
              value="login"
              className="rounded-full cursor-pointer text-sm font-medium px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 transition-all"
            >
              <LogIn className="inline-block mr-1 h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-full cursor-pointer text-sm font-medium px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-emerald-600 transition-all"
            >
              <UserPlus className="inline-block mr-1 h-4 w-4" />
              Register
            </TabsTrigger>
          </TabsList>

          {["login", "register"].map((mode) => (
            <TabsContent value={mode} key={mode}>
              <Card className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-xl shadow-md">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-semibold text-gray-800 flex justify-center items-center gap-2">
                    {mode === "login" ? <LogIn /> : <UserPlus />}
                    {mode === "login" ? "Welcome Back" : "Join Us"}
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    {mode === "login"
                      ? "Access your dashboard and manage your tasks"
                      : "Create a new account to get started"}
                  </CardDescription>
                </CardHeader>
                <form
                  onSubmit={handleSubmit((formData) =>
                    onSubmit(formData, mode as "login" | "register")
                  )}
                >
                  <CardContent className="grid gap-5">
                    <div className="grid gap-1">
                      <Label className="flex items-center gap-2 text-gray-800">
                        <Mail size={16} /> Email
                      </Label>
                      <Input
                        type="email"
                        autoComplete={
                          mode === "login" ? "current-email" : "new-email"
                        }
                        {...register("email")}
                        placeholder="you@example.com"
                        className="bg-white/70 backdrop-blur-md border-none focus:ring-2 focus:ring-indigo-300"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-1 relative">
                      <Label className="flex items-center gap-2 text-gray-800">
                        <Lock size={16} /> Password
                      </Label>
                      <Input
                        type={`${showPassword ? "text" : "password"}`}
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                        {...register("password")}
                        placeholder="••••••••"
                        className="bg-white/70 backdrop-blur-md border-none focus:ring-2 focus:ring-indigo-300"
                      />
                      <div className="absolute top-1/2 right-2">
                        {showPassword ? <EyeOff width={20} onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" /> : <Eye width={20} onClick={() => setShowPassword(!showPassword)}  className="cursor-pointer" />}
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-500">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-3">
                    <Button
                      type="submit"
                      disabled={regState.isLoading || logState.isLoading}
                      className="w-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white hover:from-indigo-600 hover:to-emerald-600 transition-all font-semibold cursor-pointer"
                    >
                      {regState.isLoading || logState.isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="animate-spin h-4 w-4" />
                          Please wait...
                        </span>
                      ) : mode === "login" ? (
                        "Login"
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
