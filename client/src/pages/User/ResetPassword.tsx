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
import { useResetPasswordMutation } from "@/redux/services/authApi";
import { toast } from "react-toastify";
import { resetPasswordSchema } from "@/schema/user.schema";

const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      await resetPassword({
        newPassword: values.newPassword,
      }).unwrap();
      toast.success("Password reset successfully");
      form.reset({
        newPassword: "",
        confirmPassword: "",
      });
      navigate("/signin");
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
              Reset Password
            </h1>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
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

export default ResetPassword;
