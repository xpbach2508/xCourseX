"use client"

import { User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";

import { cn, getRole } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { isTeacher } from "@/lib/teacher";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

interface FormData {
  ids: [],
  role: string,
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="pl-20">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const userId = String(row.getValue("id") || "");
      return (
        <div className="pl-2">
          {userId}
        </div>
      );
    }
  },
  // {
  //   accessorKey: "price",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Username
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const price = parseFloat(row.getValue("price") || "0");
  //     const formatted = new Intl.NumberFormat("vi-VN", {
  //       style: "currency",
  //       currency: "VND",
  //     }).format(price);

  //     return <div>{formatted}</div>;
  //   },
  // },
  {
    accessorKey: "role",
    accessorFn: row => getRole(row.role),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Highest Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const currentRole = String(row.getValue("role") || "");


      return (
        <div className="pl-8">
          {/* <Badge className={cn("bg-slate-500", true && "bg-sky-700" ,true && "bg-red-700")}>
            {true ? "Admin" : true ? "Teacher" : "Student"}
          </Badge> */}
          <Badge>
            {currentRole}
          </Badge>
        </div>
      );  
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const userId = String(row.getValue("id") || "");
      const isUserAdmin = isAdmin(userId);
      const isUserTeacher = isTeacher(userId);


      const handleRoleChange = async () => {
        try {
          // const newRole = isUserTeacher != true ? 'teacher' : 'user'; 
          if ( db ) {
            await db.user.update({
              where: { id: userId },
              data: {
                role: "newRole",
              },
            })
          }
          // const router = useRouter();
          // router.reload();
        } catch (error) {
          console.error("Error updating role:", error);
        }
      }
      return (
            /* TODO */
            <Button className="rounded-xl" variant="default" type="submit" onClick={handleRoleChange}>
              Change role to {true ? 'Teacher' : 'User'}
            </Button>
      );
    },
  },
];
