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
      <div className="grid grid-cols-3 border border-zinc-500 p-6 rounded-lg">
        <span>
          <p className="font-semibold">{id}</p>
          <p className="text-xs text-muted-foreground">Ticket ID</p>
        </span>
        {data && (
          <>
            <span className="flex">
              <p className="mt-1 text-base"> Title : </p>
              <p className="text-lg text-muted-foreground ml-2 mt-0.5">
                {data.title}
              </p>
            </span>
            <span className="flex ">
              <p className="mt-1 text-base">Type :</p>
              <p className=" text-lg text-muted-foreground ml-2 mt-0.5">
                {data.type}
              </p>
            </span>
            <span className=" flex ">
              <p className="mt-1 text-base">Breach Status:</p>
              <p className=" text-lg text-muted-foreground ml-2 mt-0.5 ">
                {data.breach_status}
              </p>
            </span>
            <span className=" flex ">
              <p className="mt-1 text-base">Bucket :</p>
              <p className=" text-base text-muted-foreground ml-2 mt-0.5">
                {data.bucket}
              </p>
            </span>
            <span className=" flex ">
              <p className="mt-1 text-base">Customer ID :</p>
              <p className=" text-base text-muted-foreground ml-2 mt-0.5 ">
                {data.customer_id}
              </p>
            </span>

            <span className="flex ">
              <p className="mt-1 text-base">Raised By :</p>
              <p className=" text-base text-muted-foreground ml-2 mt-0.5 ">
                {data.raised_by_id}
              </p>
            </span>

            <span className=" flex ">
              <p className="mt-1 text-base">Raised On :</p>
              <p className=" text-base text-muted-foreground ml-2 mt-0.5 ">
                {data.raised_at}
              </p>
            </span>
            <span className="flex ">
              <p className="mt-1 text-base">Severity :</p>
              <p className=" text-base text-muted-foreground ml-2 mt-0.5 ">
                {data.severity}
              </p>
            </span>
            <span className="flex ">
              <p className="mt-1 text-base">SLA Due :</p>
              <p className=" text-base text-muted-foreground ml-2 mt-0.5 ">
                {data.sla_due}
              </p>
            </span>
            <span className="flex ">
              <p className="mt-1 text-base">Status :</p>
              <p className=" text-base text-muted-foreground ml-2 mt-0.5 ">
                {data.status}
              </p>
            </span>
          </>
        )}
      </div>

      {/* <p className="font-bold text-xl mt-16">Subject:</p> */}
      <div className=" border border-zinc-500 p-6 my-6 pb-12  rounded-lg max-w-screen-2xl">
        <Tabs defaultValue="description" className="max-w-screen-2xl">
          <TabsList className="my-2 w-full flex justify-evenly border border-slate-300">
            <TabsTrigger className="w-1/3 border-zinc-300" value="description">
              Description
            </TabsTrigger>
            <TabsTrigger className="w-1/3  border-zinc-300" value="resolution">
              Resolution
            </TabsTrigger>
            <TabsTrigger className="w-1/3  border-zinc-300" value="audit">
              Audit
            </TabsTrigger>
          </TabsList>
          <div className="border border-zinc-200 p-10 bg-zinc-300 rounded-md text-slate-900 max-w-full">
            <TabsContent value="description">
              <p className="text-lg mb-4 ">Description:</p>
              {data && data.description}
            </TabsContent>

            <TabsContent value="resolution">
              <div className="mb-10 top-0 left-0">
                <div className="flex  mb-5 ">
                  <PencilLine className="h-5 w-5 mt-1 mr-2" />
                  <p className="text-lg">Resolutions:</p>
                </div>

                {prevRes.map((value, index) => (
                  <div className="flex gap-2" key={index}>
                    <p className="inline-flex items-center justify-center w-5 h-5 text-black text-xs bg-white rounded-full mt-3 mr-2">
                      {index + 1}.
                    </p>
                    <p className="text-sm mt-1 text-blue-700 pr-10 bg-slate-200 px-3 py-2 rounded-3xl">
                      {value.description}
                    </p>
                    <p className="text-sm mt-1 text-purple-900">
                      {value.supporting_files}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mb-2">Add Resolutions:</p>

              <div className="flex">
                {uploaded.map((value, index) => (
                  <div className="flex pr-1 mb-3" key={index}>
                    {/* <p className="font-medium">{index + 1}.</p> */}

                    <p className="text-sm">{value.resolution},</p>

                    {value.file && (
                      <div className="flex mr-2 text-blue-800 gap-2 text-sm">
                        {value.file.name}
                        <X
                          className="h-3 w-3 rounded-full text-red-600 border border-slate-600 mt-1 hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteRes(index)}
                        />
                        ,
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-slate-100  flex w-3/4 items-center space-x-2">
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
                <Button
                  disabled={
                    loggedInUser != currentBucket || ticketStatus === true
                  }
                  type="button"
                  onClick={handleUpload}
                >
                  Upload
                </Button>

                <Button
                  disabled={
                    loggedInUser != currentBucket || ticketStatus === true
                  }
                  type="button"
                
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <p className="text-lg mb-5">Audit:</p>

              {events.map((value, index) => (
                <div className="flex gap-2 " key={index}>
                  <p className=" inline-flex items-center justify-center w-5 h-5 mt-1 text-black text-xs bg-white rounded-full">
                    {index + 1}.
                  </p>

                  <p className="text-sm mt-1 text-blue-700 pr-10">
                    {value.event_description}
                  </p>
                  <p className="text-sm mt-1 text-purple-900 ">
                    {value.event_datetime}
                  </p>
                  <br />
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="border border-zinc-500 p-10 rounded-lg max-w-screen-2xl flex ">
        <Select  disabled={ticketStatus === true} onValueChange={(value) => handleUser(value)}>
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

        <Button
          disabled={loggedInUser != currentBucket || ticketStatus === true}
          className="ml-24"
          onClick={handleAssign}
        >
          Assign
        </Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={loggedInUser != currentBucket || ticketStatus === true}
            className="float-end mr-4 mt-6 mb-5"
            variant="destructive"
          >
            Close Ticket
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Are you sure, you want to close this ticket?
            </DialogTitle>
            <DialogDescription>This Action is irreversible!</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={handleTicketClose} variant="destructive">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default IdPage;
