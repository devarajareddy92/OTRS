import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTicketDetails } from "@/components/api/ticketDetailsApi";
import { AArrowUp, FileUp, PencilLine, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { removeToken } from "@/components/api/authApi";
import { uploadApi } from "@/components/api/uploadApi";
import { TicketDetails } from "@/lib/types";
import { SubmitUuid } from "@/components/api/submitApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUsers } from "@/components/api/userApi";
import { assign } from "@/components/api/assignApi";
import { closeTicketApi } from "@/components/api/closeTicketApi";

const IdPage = () => {
  const [data, setData] = useState<TicketDetails | null>(null);
  const [resolution, setResolution] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<
    Array<{ resolution: string; file: File | null }>
  >([]);
  const [prevRes, setPrevRes] = useState([]);
  const [uuid, setUuid] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [events, setEvents] = useState([]);
  const [selectUser, setSelectUser] = useState(false);
  const [selectGroup, setSelectGroup] = useState(false);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [ticketId, setTicketId] = useState();

  const [assignType, setAssignType] = useState("");
  const [assignToGroup, setAssignToGroup] = useState("");
  const [assignToUser, setAssignToUser] = useState("");

  const [currentBucket, setCurrentBucket] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");

  const [assignDialog, setAssignDialog] = useState(false);
  const [closeTicketDialog, setCloseTicketDialog] = useState(false);

  const [ticketStatus, setTicketStatus] = useState(false);
 

  const { id } = useParams();
  const navigate = useNavigate();

  async function handleDetailsFetch() {
    try {
      const response = await getTicketDetails(id);
      console.log(response);
      setLoggedInUser(response.data.username);
      setCurrentBucket(response.data.bucket);
      setData(response.data);
      console.log(response.data);

      setPrevRes(response.data.resolutions || []);
      setEvents(response.data.eventLog || []);
      setTicketId(response.data.ticket_id);

      if (response.data.status === "closed") {
        setTicketStatus(true);
      }

      console.log(events);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        removeToken();
        navigate("/login");
      }
    }
  }

  useEffect(() => {
    handleDetailsFetch();
  }, [id]);

  const handleResolutionChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setResolution(e.target.value);
  };

  const handleFileChange = (e: {
    target: { files: React.SetStateAction<null>[] };
  }) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (resolution === "" && file === null) {
      alert("Enter Resolution or File");
    } else {
      setUploaded([...uploaded, { resolution, file }]);
      console.log(file.name);

      setResolution("");
      setFile(null);

      try {
        const response = await uploadApi(file);
        setDescription(resolution);
        setTitle(response.data.title);
        setUuid([...uuid, response.data.file_path]);
        console.log(uuid);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          removeToken();
          alert("Session expired! Login again.");
          navigate("/login");
        } else {
          alert("Something went wrong");
        }
      }
    }
  };

  const handleDeleteRes = (index: number) => {
    const updatedUploaded = [...uploaded];
    updatedUploaded.splice(index, 1);
    setUploaded(updatedUploaded);
  };

  const handleSubmit = async () => {
    try {
      const response = await SubmitUuid(uuid, id, title, description);
      console.log(uuid);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUser = async (value: string) => {
    if (loggedInUser != currentBucket) {
      setAssignDialog(true);
      console.log("hello");
    } else if (value === "user") {
      setSelectUser(true);
      setSelectGroup(false);
      setAssignType(value);
      try {
        const response = await getUsers();
        console.log(response.data);
        setUsers(response.data.users);
        setGroups(response.data.groups);
      } catch (error) {
        console.log(error);
      }
    } else if (value === "group") {
      setSelectGroup(true);
      setSelectUser(false);
      setAssignType(value);
      try {
        const response = await getUsers();
        console.log(response.data);
        setUsers(response.data.users);
        setGroups(response.data.groups);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAssign = async () => {
    try {
      const response = await assign(
        assignType,
        assignToGroup,
        assignToUser,
        ticketId,
        id
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTicketClose = async () => {


    try {
      const response = await closeTicketApi(id);

      setCloseTicketDialog(true);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 border border-muted p-6 rounded-lg">
        <span>
          <p className="font-semibold">{id}</p>
          <p className="text-xs text-muted-foreground">Ticket ID</p>
        </span>
        {data && (
          <>
            <p className="text-xl font-medium">Title: {data.title}</p>
            <p className="text-xl font-medium">Type: {data.type}</p>
            <p>Breach Status: {data.breach_status}</p>
            <p>Bucket: {data.bucket}</p>
            <p>Customer ID: {data.customer_id}</p>
            <p>Raised by: {data.raised_by_id}</p>
            <p>Raised On: {data.raised_at}</p>
            <p>Severity: {data.severity}</p>
            <p>SLA Due: {data.sla_due}</p>
            <p>Status: {data.status}</p>
          </>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={loggedInUser != currentBucket || ticketStatus === true} className="w-2/5 mt-5" variant="destructive">
              Close Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Are you sure, you want to close this ticket?
              </DialogTitle>
              <DialogDescription>
                This Action is irreversible!
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button  onClick={handleTicketClose} variant="destructive">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* <p className="font-bold text-xl mt-16">Subject:</p> */}
      <div className=" border border-muted p-6 my-6 pb-12 rounded-lg max-w-screen-2xl">
        <Tabs defaultValue="account" className="max-w-screen-2xl">
          <TabsList className="my-8 w-full flex justify-evenly">
            <TabsTrigger className="w-1/3" value="description">
              Description
            </TabsTrigger>
            <TabsTrigger className="w-1/3" value="resolution">
              Resolution
            </TabsTrigger>
            <TabsTrigger className="w-1/3" value="audit">
              Audit
            </TabsTrigger>
          </TabsList>
          <div className="border border-muted p-10 bg-zinc-300 rounded-md text-slate-900 max-w-full">
            <TabsContent value="description">
              <p className="text-2xl">Description:</p>
              {data && data.description}
            </TabsContent>

            <TabsContent value="resolution">
              <div className="mb-10 top-0 left-0">
                <PencilLine className="mb-10 h-5 w-5" />
                <Button disabled={loggedInUser != currentBucket} className="float-right" onClick={handleSubmit}>
                  Submit
                </Button>

                <p className="text-2xl mb-5">Resolutions:</p>

                {prevRes.map((value, index) => (
                  <div className="flex gap-2" key={index}>
                    <p>{index + 1}.</p>
                    <p className="text-sm mt-1 text-blue-700 pr-10">
                      {value.description}
                    </p>
                    <p className="text-sm mt-1 text-purple-900">
                      {value.supporting_files}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mb-2">Add Resolutions:</p>

              {uploaded.map((value, index) => (
                <div className="flex gap-1 pl-4 pr-2 mb-3" key={index}>
                  <p className="font-medium">{index + 1}.</p>
                  <p>{value.resolution}</p>

                  {value.file && (
                    <div className="flex mr-4 text-blue-800 gap-3">
                      {value.file.name}
                      <X
                        className="h-3 w-3 text-red-600 border border-slate-600 mt-2 hover:bg-red-600 hover:text-white"
                        onClick={() => handleDeleteRes(index)}
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="text-slate-100 flex w-3/4 items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Write your Resolution here..."
                  value={resolution}
                  onChange={handleResolutionChange}
                />
                <Input
                  className="w-2/5 px-1"
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                />
                <Button disabled={loggedInUser != currentBucket} type="button" onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <p className="text-2xl mb-5">Audit</p>

              <p className="w-4 h-4">1</p>

              {events.map((value, index) => (
                <div className="flex gap-2" key={index}>
                  <p className="">{index + 1}.</p>

                  <p className="text-sm mt-1 text-blue-700 pr-10">
                    {value.event_description}
                  </p>
                  <p className="text-sm mt-1 text-purple-900">
                    {value.event_datetime}
                  </p>
                  <br />
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="border border-muted p-10 rounded-lg max-w-screen-2xl flex ">
        <Select onValueChange={(value) => handleUser(value)}>
          <p className="pt-2 pr-2">Assign to:</p>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex ">
          {selectUser && (
            <Select onValueChange={(value) => setAssignToUser(value)}>
              <p className="pt-2 pr-2 ml-20">Users:</p>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {users.map((value, index) => (
                  <SelectItem value={value.username} key={index}>
                    {value.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex">
          {selectGroup && (
            <Select onValueChange={(value) => setAssignToGroup(value)}>
              <p className="pt-2 pr-2 ml-20">Groups:</p>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((value, index) => (
                  <SelectItem value={value.group_name} key={index}>
                    {value.group_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button disabled={loggedInUser != currentBucket} className="ml-24" onClick={handleAssign}>
          Assign
        </Button>
      </div>

      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket is not in your bucket!</DialogTitle>
            <DialogDescription>Cannot Assign!</DialogDescription>
          </DialogHeader>
          Try Assigning some other ticket.
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeTicketDialog} onOpenChange={setCloseTicketDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket Closed Successfully</DialogTitle>
            <DialogDescription>
              The ticket has been closed and no further actions are required.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => navigate("/")} variant="primary">
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={ticketStatus} onOpenChange={setTicketStatus}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket already closed</DialogTitle>
            <DialogDescription>
              This ticket is already closed. No further actions can be taken.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => navigate("/")} variant="primary">
              Back to Tickets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default IdPage;
