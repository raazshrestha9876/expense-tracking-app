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
import { useNavigate } from "react-router-dom";
import { useForgetPasswordMutation } from "@/redux/services/authApi";
import { toast } from "react-toastify";
import { forgetPasswordSchema } from "@/schema/user.schema";

const ForgetPassword = () => {
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (values: z.infer<typeof forgetPasswordSchema>) => {
    try {
      await forgetPassword(values).unwrap();
      toast.success("Password reset link sent to your email");
      form.reset({
        email: "",
      });
      navigate("/forget-password/verify-otp");
    } catch (error: any) {
      toast.error(error.message);
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
            <h1 className="text-xl text-white text-center leading-1.5 mb-2">
              Forget password
            </h1>
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

            <Button type="submit" className="py-5">
              {isLoading ? "loading..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default ForgetPassword;
