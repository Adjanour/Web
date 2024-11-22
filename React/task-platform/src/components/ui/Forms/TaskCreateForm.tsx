import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";

const TaskCreateFormSchema = z.object({
    taskName: z.string().min(1).max(100),
    taskSlug: z.string().min(1).max(30),
    taskPriorityID: z.string().min(1).max(30),
    taskStatusID: z.string().min(1).max(30),
    taskOwnerUserID: z.string().min(1).max(30),
    taskStartDate: z.date().optional(),
    taskEndDate: z.date().optional(),
    taskDescription: z.string().max(1000),
});

export const TaskCreateForm = () => {
    const form = useForm<z.infer<typeof TaskCreateFormSchema>>({
        resolver: zodResolver(TaskCreateFormSchema),
        defaultValues: {
            taskName: "",
            taskSlug: "",
            taskPriorityID: "",
            taskStatusID: "",
            taskOwnerUserID: "",
            taskStartDate: new Date(),
            taskEndDate: new Date(),
            taskDescription: "",
        },
    });

    function onSubmit(data: z.infer<typeof TaskCreateFormSchema>) {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 p-6 bg-white shadow-lg rounded-lg"
            >
                {/* Task Name Field */}
                <FormField
                    name="taskName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-lg">
                                Task Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the name of the task"
                                    className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 mt-1">
                                {form.formState.errors.taskName?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                {/* Task Slug Field */}
                <FormField
                    name="taskSlug"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-lg">
                                Task Slug
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the slug of the task"
                                    className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 mt-1">
                                {form.formState.errors.taskSlug?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                {/* Task Description Field */}
                <FormField
                    name="taskDescription"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-lg">
                                Task Description
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter the description of the task"
                                    className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 mt-1">
                                {form.formState.errors.taskDescription?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                {/* Task Priority Field */}
                <FormField
                    name="taskPriorityID"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-lg">
                                Task Priority
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter the priority of the task"
                                    className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 mt-1">
                                {form.formState.errors.taskPriorityID?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                {/* Task Status Field */}
                <FormField
                    name="taskStatusID"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-lg">
                                Task Status
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter the status of the task"
                                    className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 mt-1">
                                {form.formState.errors.taskStatusID?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                {/* Task Owner Field */}
                <FormField
                    name="taskOwnerUserID"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-semibold text-lg">
                                Task Owner
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter the owner of the task"
                                    className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 mt-1">
                                {form.formState.errors.taskOwnerUserID?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                {/* Task Start Date Field */}
                <FormField
                    name="taskStartDate"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="font-semibold text-lg">
                                Start Date
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
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
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />

                {/* Task End Date Field */}
                <FormField
                    name="taskEndDate"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="font-semibold text-lg">
                                End Date
                            </FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value &&
                                                    "text-muted-foreground"
                                            )}
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
                                        className="bg-white"
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create Task
                </Button>
            </form>
        </Form>
    );
};
