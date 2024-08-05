import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTicketDetails } from "@/components/api/ticketDetailsApi";
import { FileUp, PencilLine } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Value } from "@radix-ui/react-select";
import { Description } from "@radix-ui/react-toast";

const IdPage = () => {
  const [data, setData] = useState({});
  const [resolution, setResolution] = useState("");
  const [file, setFile] = useState(null);
  const [submittedResolution, setSubmittedResolution] = useState("");
  const [submittedFile, setSubmittedFile] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  async function handleDetailsFetch() {
    try {
      const response = await getTicketDetails(id);
      console.log(response);

      
      setData(response.data);
    } catch (error) {
      console.log(error);
      
      if(error.response.status === 401 ){
        navigate("/login");
      }
    }
  }

  useEffect(() => {
    handleDetailsFetch();
  }, [id]);

  const handleResolutionChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setResolution(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    setSubmittedResolution(resolution);
    setSubmittedFile(file);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 border border-muted p-6 rounded-lg">
        <span>
          <p className="font-semibold">{id}</p>
          <p className="text-xs text-muted-foreground">Ticket ID</p>
        </span>
        <p>Title : {data.title}</p>
        <p>Type : {data.type}</p>
        <p>Breach Status : {data.breach_status}</p>
        <p>Bucket: {data.bucket}</p>
        <p>Customer ID : {data.customer_id}</p>
        <p>Raised by : {data.raised_by_id}</p>
        <p>Raised On : {data.raised_at}</p>
        <p>Severity : {data.severity}</p>
        <p>SLA Due : {data.sla_due}</p>
        <p>Status : {data.status}</p>
      </div>

      <p className="font-bold text-xl mt-16">Subject :</p>
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
              <p className="text-xl">description</p>
              {data.description}
            </TabsContent>

            <TabsContent value="resolution">
              <div className="mb-10 top-0 left-0">
                <PencilLine className="mb-10 h-6 w-5" />
                <Button className="float-right">Submit</Button>

                <p className="text-2xl">Resolutions :</p>
                {submittedResolution && (
                  <div className="mt-4">
                    <p>{submittedResolution}</p>
                  {submittedFile && <p>File: {submittedFile.name}</p>}
                  </div>
                )}
              </div>

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

            <TabsContent value="audit">Audit is here.</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default IdPage;
