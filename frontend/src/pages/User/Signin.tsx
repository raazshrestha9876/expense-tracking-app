import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "@/schema/user.schema";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import { useLoginMutation } from "@/redux/services/authApi";
import { setLogin } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import { expenseApi } from "@/redux/services/expenseApi";
import { incomeApi } from "@/redux/services/incomeApi";

const Signin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const invalidateAllTags = () => {
    dispatch(
      expenseApi.util.invalidateTags([
        "Expense",
        "Expense-stats",
        "Expense-notification",
      ])
    );
    dispatch(
      incomeApi.util.invalidateTags([
        "income",
        "income-stats",
        "income-notification",
      ])
    );
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await login(values).unwrap();
      dispatch(setLogin(response));

      invalidateAllTags();
      form.reset({
        email: "",
        password: "",
      });

      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Invalid Login");
    }
  };

  return (
    <Form {...form}>
      <div className="h-screen bg-slate-700 flex row">
        <div className="flex-1 bg-white">
          <img
            src="https://png.pngtree.com/png-clipart/20230923/original/pngtree-budget-planning-and-expense-tracking-app-for-efficient-financial-management-vector-png-image_12734376.png"
            alt=""
            className="h-full"
          />
        </div>
        <div className="flex-1">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-[60%] mx-auto h-full flex flex-col justify-center gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="py-5 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      {...field}
                      className="py-5 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="py-5">
              {isLoading ? "loading..." : "login"}
            </Button>
            <Button type="button" className="py-5 w-full" variant="outline">
              <img
                className="h-7 w-7"
                src="https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0-852x852.jpg"
                alt="google"
              />{" "}
              Sign in with Google
            </Button>
            <div className="flex flex-row justify-between items-center">
              <Link to={"/signup"}>
                <p className=" text-white hover:underline">
                  Create a new account?{" "}
                  <span className="text-red-600">Sign up</span>
                </p>
              </Link>

              <Link to={"/forgot-password"}>
                <p className=" text-white hover:underline">Forget Password? </p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default Signin;
