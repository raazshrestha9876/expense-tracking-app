import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifyOtpMutation } from "@/redux/services/authApi";
import { verifyOtpSchema } from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { z } from "zod";

const OTP = () => {
  const form = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof verifyOtpSchema>) => {
    try {
      const response = await verifyOtp(values).unwrap();
      if (response.success) {
        toast.success(response.message);
        form.reset({
          otp: "",
        });
        navigate("/reset-password", { replace: true });
      }
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
            <h1 className="text-xl text-white text-center leading-1.5">
              One Time Password Verification
            </h1>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup className="gap-6">
                          <InputOTPSlot
                            index={0}
                            className="w-12 h-12 text-lg text-white font-semibold border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                          />
                          <InputOTPSlot
                            index={1}
                            className="w-12 h-12 text-lg text-white font-semibold border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                          />
                          <InputOTPSlot
                            index={2}
                            className="w-12 h-12 text-lg text-white font-semibold border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                          />
                          <InputOTPSlot
                            index={3}
                            className="w-12 h-12 text-lg text-white font-semibold border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                          />
                          <InputOTPSlot
                            index={4}
                            className="w-12 h-12 text-lg text-white font-semibold border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                          />
                          <InputOTPSlot
                            index={5}
                            className="w-12 h-12 text-lg text-white font-semibold border-2 border-slate-200 focus:border-blue-500 rounded-lg"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="py-5 w-[90%] mx-auto mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default OTP;
