"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { hasPermission } from "@/lib/auth"
import { ArrowLeft, Bot, Info } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { apiClient, type BotConfig } from "@/lib/api-client"
import { createBot } from "@/lib/api/bots"

// Define the form schema with Zod
const botFormSchema = z.object({
  EMAIL: z.string().email("Please enter a valid email address"),
  PASSWORD: z.string().min(6, "Password must be at least 6 characters"),
  COUNTRY: z.string().min(1, "Please select a country"),
  FACILITY_ID: z.string().optional().nullable(),
  ASC_FACILITY_ID: z.string().optional().nullable(),
  SCHEDULE_ID: z.string().optional().nullable(),
  MIN_DATE: z.string().optional().nullable(),
  MAX_DATE: z.string().optional().nullable(),
})

type BotFormValues = z.infer<typeof botFormSchema>

export default function CreateBotPageClient() {
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isAdmin = hasPermission("admin")
  const countries = apiClient.getCountries()
  const facilities = apiClient.getFacilities()
  const ascFacilities = apiClient.getASCFacilities()

  // Initialize form with default values
  const form = useForm<BotFormValues>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      EMAIL: "",
      PASSWORD: "",
      COUNTRY: "",
      FACILITY_ID: null,
      ASC_FACILITY_ID: null,
      SCHEDULE_ID: null,
      MIN_DATE: null,
      MAX_DATE: null,
    },
  })

  // Redirect if not admin
  if (!isAdmin) {
    router.push("/bots")
    return null
  }

  const onSubmit = async (data: BotFormValues) => {
    setIsSubmitting(true)

    try {
      // Convert form data to BotConfig
      const botConfig: BotConfig = {
        EMAIL: data.EMAIL,
        PASSWORD: data.PASSWORD,
        COUNTRY: data.COUNTRY,
        FACILITY_ID: data.FACILITY_ID || null,
        ASC_FACILITY_ID: data.ASC_FACILITY_ID || null,
        SCHEDULE_ID: data.SCHEDULE_ID || null,
        MIN_DATE: data.MIN_DATE || null,
        MAX_DATE: data.MAX_DATE || null,
      }

      // Create the bot
      const response = await createBot(botConfig)

      toast({
        title: "Bot created successfully",
        description: `Bot for ${data.EMAIL} has been created and is ready to run.`,
      })

      router.push("/bots")
    } catch (error) {
      toast({
        title: "Failed to create bot",
        description:
          error instanceof Error ? error.message : "An error occurred while creating the bot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const goToNextTab = () => {
    if (activeTab === "basic") setActiveTab("advanced")
  }

  const goToPreviousTab = () => {
    if (activeTab === "advanced") setActiveTab("basic")
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/bots")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create Bot</h1>
        </div>
        <p className="text-muted-foreground">Configure a new visa appointment bot</p>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              New Bot Configuration
            </CardTitle>
            <CardDescription>Fill out the form below to create a new visa appointment bot.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Information</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="EMAIL"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="user@example.com" {...field} />
                            </FormControl>
                            <FormDescription>Email for the visa appointment account</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="PASSWORD"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormDescription>Password for the visa appointment account</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="COUNTRY"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Country where you want to book an appointment</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="mt-4 flex justify-end">
                      <Button type="button" onClick={goToNextTab}>
                        Continue to Advanced Options
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="FACILITY_ID"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facility ID</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a facility" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {facilities.map((facility) => (
                                  <SelectItem key={facility.id} value={facility.id}>
                                    {facility.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Embassy or consulate location</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ASC_FACILITY_ID"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ASC Facility ID</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || undefined}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an ASC facility" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None (Skip ASC appointment)</SelectItem>
                                {ascFacilities.map((facility) => (
                                  <SelectItem key={facility.id} value={facility.id}>
                                    {facility.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>ASC location (if applicable)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="SCHEDULE_ID"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schedule ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional Schedule ID" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription>
                            <span className="flex items-center gap-1">
                              <Info className="h-3 w-3" />
                              Only required for certain countries
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="MIN_DATE"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormDescription>Earliest date to accept (optional)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="MAX_DATE"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormDescription>Latest date to accept (optional)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={goToPreviousTab}>
                        Back to Basic Information
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating Bot..." : "Create Bot"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
