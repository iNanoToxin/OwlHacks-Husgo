import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row relative">
      <div className="h-screen w-16 absolute top-0 left-0 flex flex-col items-center bg-white dark:bg-slate-800 py-5 justify-between">
        {/*
        <div className="">
          <Avatar>
            <AvatarImage src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" />
          </Avatar>
        </div>

        <div className="">
          <Button variant={"ghost"} >
            <i className="fa-solid fa-right-from-bracket text-xl"></i>
          </Button>
        </div>
        */}
      </div>
      <div className="" /*style={{ marginLeft: "64px" }}*/>
        <div className="absolute top-0 right-0 z-100 p-1 bg-white">PhillyGo</div>

        {children}
      </div>
    </div>
  );
}
