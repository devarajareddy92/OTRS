import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IdPage = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <div className=" grid grid-cols-2 border border-muted p-6 rounded-lg">
        <p>Ticket {id} :</p>
        <p>Raised by :</p>
        <p>Raised On :</p>
        <p>Technician :</p>
        <p>Due Date :</p>
        <p>Priority :</p>
        <p>Resolution DA :</p>
        <p>Resolved By :</p>
      </div>

      <div className="border border-muted p-6 m-6 rounded-lg">
        <p className="font-bold text-xl">Subject :</p>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="my-8 w-full flex justify-evenly">
            <TabsTrigger className="" value="resolution">Resolution</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>
          <TabsContent value="description">Description is here</TabsContent>
          <TabsContent value="resolution">Resolution is here.</TabsContent>
          <TabsContent value="audit">Audit is here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IdPage;
