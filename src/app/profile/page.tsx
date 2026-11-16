"use client";

import Image from "next/image";
import { authClient } from "../lib/auth-client";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [name, setName] = useState(user?.name || "");
    const [isLoading, setIsLoading] = useState(false);

    // সাইন আউট হ্যান্ডলার (যদি আপনার আগের কোডে ফাংশন যুক্ত করতে চান)
    const handleSignOut = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("সফলভাবে সাইন আউট হয়েছে!");
                        router.push("/signin");
                    },
                },
            });
        } catch (error) {
            toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
        }
    };

    // নাম আপডেট হ্যান্ডলার
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("নামের ফিল্ডটি খালি রাখা যাবে না।");
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await authClient.updateUser({
                name: name,
            });

            if (error) {
                toast.error(error.message || "নাম আপডেট করা যায়নি।");
            } else {
                toast.success("নাম সফলভাবে আপডেট হয়েছে!");
                router.refresh();
            }
        } catch (error) {
            toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f9f6] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* পেজ হেডার */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        আমার প্রোফাইল
                    </h1>
                    <p className="text-sm text-gray-500">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                    </p>
                </div>

                {/* ইউজার ইনফো কার্ড */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200">
                            <Image
                                fill
                                src={(user?.image as string) || "/default-avatar.png"}
                                alt="User Avatar"
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                {user?.name || "ব্যবহারকারী"}
                            </h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                    </div>

                    {/* সাইন আউট বাটন */}
                    <button
                        onClick={handleSignOut}
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        সাইন আউট
                    </button>
                </div>

                {/* তথ্য আপডেট সেকশন */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                        তথ্য
                    </h3>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                নাম
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="appearance-none relative block w-full px-3 py-2.5 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 sm:text-sm bg-white"
                                placeholder="আপনার নাম লিখুন"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full cursor-pointer py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#15803d] hover:bg-[#166534] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm disabled:bg-green-400"
                        >
                            {isLoading ? "আপডেট হচ্ছে..." : "আপডেট"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;