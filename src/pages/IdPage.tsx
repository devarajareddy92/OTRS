import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTicketDetails } from "@/components/api/ticketDetailsApi";
import { FileUp, PencilLine, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { removeToken } from "@/components/api/authApi";
import { uploadApi } from "@/components/api/uploadApi";
import { TicketDetails } from "@/lib/types";
import { SubmitUuid } from "@/components/api/submitApi";

const IdPage = () => {
  const [data, setData] = useState<TicketDetails>(null);
  const [resolution, setResolution] = useState("");
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState([]);
  const [prevRes, setPrevRes] = useState([]);
  const [uuid, setUuid] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [events, setEvents] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  async function handleDetailsFetch() {
    try {
      const response = await getTicketDetails(id);
      console.log(response);

      console.log(events);

      setData(response.data);

      setPrevRes(response.data.resolutions || []);
      setEvents(response.data.eventLog || []);
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

  const handleResolutionChange = (e) => {
    setResolution(e.target.value);
  };

  const handleFileChange = (e) => {
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

  const handleDeleteRes = (index) => {
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
      </div>

      <p className="font-bold text-xl mt-16">Subject:</p>
      <div className="border border-muted p-6 my-6 pb-12 rounded-lg max-w-screen-2xl">
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
                <Button className="float-right" onClick={handleSubmit}>
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
                <Button type="button" onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <p className="text-2xl mb-5">Audit</p>

              {events.map((value, index) => (
                <div className="flex gap-2" key={index}>
                  <p>{index + 1}.</p>

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
      <div className="border border-muted p-6 my-6 pb-12 rounded-lg max-w-screen-2xl">
        {/* <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
    </div>
  );
};

export default IdPage;
