
 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
 
  DialogFooter
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom";
import KPI from "@/components/kpi";
import App from "@/tanStack/tableTanStack";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
 
const Home = () => {
  const navigate = useNavigate();
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false);
 
  return (
    <div>
      <KPI />
      <div className="flex justify-end">
 

        <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
          className="mt-5 mr-5 p-5 bg-blue-600 rounded-full"
          variant="outline"
          onClick={() => setNewTicketDialogOpen(true)}
          
        >
          +
        </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click here to create a New ticket</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
        {newTicketDialogOpen && (
          <Dialog open={newTicketDialogOpen} onOpenChange={setNewTicketDialogOpen}>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Add New Ticket</DialogTitle>
                <DialogDescription>Fill in the details to create a new ticket</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                {/* <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customertoken" className="text-left">
                    Customer Token
                  </Label>
                  <Input
                    id="customertoken"
                    type="number"
                    className="col-span-3"
                  />
                </div> */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tickettype" className="text-left">
                    Ticket Type
                  </Label>
                  <select id="tickettype" className="col-span-3">
                    <option value="issue">Issue</option>
                    <option value="request">Request</option>
                  </select>
                </div>
               
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="severity" className="text-left">
                    Severity
                  </Label>
                  <select id="severity" className="col-span-3">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ticketdate" className="text-left">
                    Ticket Date
                  </Label>
                  <Input
                    id="ticketdate"
                    type="date"
                    className="col-span-3"
                  />
                </div>
 
 
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-left">
                    Title
                  </Label>
                  <Input id="title" type="text" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-left">
                    Description
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="remarks" className="text-left">
                    Remarks
                  </Label>
                  <Input id="remarks" type="text" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="Accesstype" className="text-left">
                  Assign Type
                  </Label>
                  <select id="Accesstype" className="col-span-3">
                    <option value="user">User</option>
                    <option value="Group">Group</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="Accesstype" className="text-left">
                  Assign To
                  </Label>
                  <select id="Accesstype" className="col-span-3">
                    <option value="user">Use_Listr</option>
                    <option value="Group">Group_List</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="attachments" className="text-left">
                    Upload Attachments
                  </Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    className="col-span-3"
                  />
                </div>
              </div>
 
              <DialogFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={() => setNewTicketDialogOpen(false)}>
                    Create Ticket
                  </Button>
                </SheetClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button className=" mt-5 mr-5 p-5 bg-violet-700" variant="outline">
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Apply Filters</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ticketId" className="text-left">
                  Ticket Id
                </Label>
                <Input
                  id="ticketId"
                  type="number"
                  value={0}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ticketBucket" className="text-left">
                  Ticket Bucket
                </Label>
                <Input
                  id="ticketBucket"
                  type="text"
                  value=""
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdOn" className="text-left">
                  Created On
                </Label>
                <Input
                  id="createdOn"
                  type="date"
                  value=""
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="createdBy" className="text-left">
                  Created By
                </Label>
                <Input
                  id="createdBy"
                  type="text"
                  value=""
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-left">
                  Severity
                </Label>
                <Input
                  id="severity"
                  type="text"
                  value=""
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-left">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value=""
                  className="col-span-3"
                />
              </div>
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="technician" className="text-left">
                  Technician
                </Label>
                <Input
                  id="technician"
                  type="text"
                  value=""
                  className="col-span-3"
                />
              </div> */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-left">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value=""
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="breachStatus" className="text-left">
                  Breach Status
                </Label>
                <Input
                  id="breachStatus"
                  type="text"
                  value=""
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="assigned/Pickup" className="text-left">
                  Assigned/Pickup
                </Label>
                <Input
                  id="assignedPickup"
                  type="text"
                  value=""
                  className="col-span-3"
                />
              </div>
            </div>
 
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Apply</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
 
      <div className="mt-2">
        {/* <Table>
          <TableCaption>A list of your recent tickets.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead id="ticketId" className="w-[100px]">
                Ticket Id
              </TableHead>
 
              <TableHead>Ticket Bucket</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>technician</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Breach Status</TableHead>
              <TableHead className="text-right">Assign/Pickup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                className="font-medium text-left cursor-pointer hover:bg-violet-600"
                onClick={() => navigate(`idPage/1`)}
              >
                1
              </TableCell>
              <TableCell>Infosec</TableCell>
              <TableCell>10-02-2022-:11:00</TableCell>
              <TableCell>Sec-tool</TableCell>
              <TableCell className="">P1</TableCell>
              <TableCell className="">High:XSS</TableCell>
              <TableCell className="">L1-avaliable</TableCell>
              <TableCell className="">22-07-2022:12:00</TableCell>
              <TableCell className="">Not Breached</TableCell>
 
              <TableCell className="text-right">L1-vaibhav</TableCell>
            </TableRow>
          </TableBody>
        </Table> */}
 
        <App />
      </div>
    </div>
  );
};
 
export default Home;
 