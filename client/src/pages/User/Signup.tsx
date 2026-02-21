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
import { registerSchema } from "@/schema/user.schema";
import { useRegisterMutation } from "@/redux/services/authApi";
import { toast } from "react-toastify";

const Signup = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      await register(values).unwrap();
      form.reset({
        name: "",
        email: "",
        password: "",
      });
      navigate("/signin");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <div className="h-screen bg-slate-700 flex flex-row">
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
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
              {isLoading ? "loading..." : "Register"}
            </Button>

            <div>
              <Button type="button" variant="outline" className="w-full py-5">
                <img
                  className="h-7 w-7"
                  src="https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0-852x852.jpg"
                  alt="google"
                />{" "}
                Sign up with Google
              </Button>
              <Link to={"/signin"} className="flex flex-row gap-1">
                <p className="mt-2 text-white hover:underline">
                  Already have an account?{" "}
                  <span className="text-red-600">Sign in</span>
                </p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default Signup;
