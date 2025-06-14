import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { updateProfileSchema } from "@/schema/user.schema";
import { toast } from "react-toastify";
import { z } from "zod";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/redux/services/authApi";
import {
  fetchUser,
  setError,
  setLoading,
  setUpdatedUser,
} from "@/redux/slices/authSlice";

import { useEffect, useRef, useState } from "react";
import PasswordChangeForm from "@/components/PasswordChangeForm";

const UpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: userData } = useGetUserQuery();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (userData) {
      dispatch(fetchUser(userData));
      form.reset({
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber || "",
        address: userData.address || "",
        dob: userData?.dob ? new Date(userData.dob) : undefined,
        occupation: userData.occupation || "",
        image: userData.image || "",
        gender: userData?.gender,
      });
    }
  }, [userData, dispatch, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "image") {
        const file = value.image;
        if (file instanceof File) {
          const objectUrl = URL.createObjectURL(file);
          setImagePreview(objectUrl);
          return () => URL.revokeObjectURL(objectUrl);
        } else if (typeof file === "string") {
          setImagePreview(file);
        } else {
          setImagePreview("");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    dispatch(setLoading());
    try {
      const payload = {
        ...data,
        image: typeof data.image === "string" ? data.image : undefined,
      };
      const response = await updateUser(payload).unwrap();
      dispatch(setUpdatedUser(response));
      toast.success("Profile updated successfully");
    } catch (error: any) {
      dispatch(setError(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="container max-w-7xl py-6">
      <div className="space-y-6">
        <div className="ml-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Update your profile information and preferences.
          </p>
        </div>
        <div className="flex gap-6 w-[100vw] px-20 ">
          <div className="w-full flex-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-10"
              >
                <Card className="border-none shadow-none bg-gray-50">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-32 w-32">
                          <AvatarImage
                            src={
                              imagePreview ||
                              "https://thumbs.dreamstime.com/b/generic-person-gray-photo-placeholder-man-silhouette-white-background-144511705.jpg"
                            }
                            alt="Profile"
                          />
                          <AvatarFallback>
                            {form.watch("name")?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <FormField
                          control={form.control}
                          name="image"
                          render={() => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <Input
                                    ref={fileRef}
                                    type="file"
                                    className="hidden bg-white"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        form.setValue("image", file);
                                      }
                                    }}
                                    accept="image/*"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 cursor-pointer"
                                    onClick={() => {
                                      fileRef.current?.click();
                                    }}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Change
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-6 w-full sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-white"
                                  placeholder="Enter your full name"
                                  {...field}
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  className="bg-white"
                                  placeholder="Enter your email"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="Enter your phone number"
                                  {...field}
                                  className="bg-white"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={userData?.gender}
                              >
                                <FormControl className="w-full bg-white">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-white"
                                placeholder="Enter your occupation"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your address"
                              className="resize-none bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
