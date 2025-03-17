"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"

export default function TabsSection({ data }) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <div className="overflow-x-auto">
        <TabsList className="h-auto p-0 bg-transparent space-x-1 ">
          <TabsTrigger
            value="description"
            className="px-6 py-3 border rounded-xl data-[state=active]:bg-blue-800 data-[state=active]:text-white"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="hightlights"
            className="px-6 py-3 border rounded-xl data-[state=active]:bg-blue-800 data-[state=active]:text-white"
          >
            Hightlights
          </TabsTrigger>
          {/* <TabsTrigger
            value="inspection"
            className="px-6 py-3 rounded-none data-[state=active]:bg-blue-800 data-[state=active]:text-white"
          >
            Inspection & Collection
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="px-6 py-3 rounded-none data-[state=active]:bg-blue-800 data-[state=active]:text-white"
          >
            Added Services
          </TabsTrigger>
          <TabsTrigger
            value="more"
            className="px-3 py-3 rounded-none data-[state=active]:bg-blue-800 data-[state=active]:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </TabsTrigger> */}
        </TabsList>
      </div>

      <TabsContent value="description" className="mt-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">DESCRIPTION</h2>
        <div dangerouslySetInnerHTML={{ __html: data.CarSubmission.description }}/>
      </TabsContent>

      <TabsContent value="hightlights" className="mt-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Higlights</h2>
          <div dangerouslySetInnerHTML={{ __html: data.CarSubmission.highlights }}/>
      </TabsContent>

      <TabsContent value="inspection" className="mt-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">INSPECTION & COLLECTION</h2>
        <div className="prose max-w-none">{data.inspectionDetails}</div>
      </TabsContent>

      <TabsContent value="services" className="mt-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">ADDED SERVICES</h2>
        <div className="prose max-w-none">{data.addedServices}</div>
      </TabsContent>
    </Tabs>
  )
}

