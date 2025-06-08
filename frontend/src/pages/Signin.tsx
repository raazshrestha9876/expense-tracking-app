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
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const Signup = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
                  <Input placeholder="shadcn" {...field} className="py-5" />
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
                  <Input placeholder="shadcn" {...field} className="py-5"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="py-5">Submit</Button>
          <div>
            <Button type="button" className="py-5 w-full" variant="outline" >
              <img
                className="h-7 w-7"
                src="https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0-852x852.jpg"
                alt="google"
              />{" "}
              Sign in with Google
            </Button>
            <Link to={"/signup"}>
              <p className="mt-2 text-white">
                Create a new account?{" "}
                <span className="text-red-600">Sign up</span>
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
