import { Home, Users, Building2, CarFront, Gavel, Banknote, ShoppingCart, ImageIcon, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Menu items with updated icons
const items = [
  {
    title: "Home",
    url: "/Admin",
    icon: Home,
  },
  {
    title: "User Management",
    url: "/Admin/Pages/UserManagement",
    icon: Users,
  },
  // {
  //   title: "Brand Management",
  //   url: "/Admin/Pages/BrandManagement",
  //   icon: Building2,
  // },
  {
    title: "Car Submissions",
    url: "/Admin/Pages/CarSubmission",
    icon: CarFront,
  },
  {
    title: "Auction Management",
    url: "/Admin/Pages/AuctionManagement",
    icon: Gavel,
  },
  {
    title: "Bidding",
    url: "/Admin/Pages/BiddingManagement",
    icon: Banknote,
  },
  {
    title: "SoldOut",
    url: "/Admin/Pages/SoldOutManagement",
    icon: ShoppingCart,
  },
  {
    title: "Hold Payment",
    url: "/Admin/Pages/HoldPayments",
    icon: ImageIcon,
  },
  {
    title: "Transactions",
    url: "/Admin/Pages/Transactions",
    icon: ImageIcon,
  },
  {
    title: "Slider",
    url: "/Admin/Pages/Slider",
    icon: ImageIcon,
  },
  {
    title: "Service Provider",
    url: "/Admin/Pages/Service-Provider/User",
    icon: ImageIcon,
  },
  // {
  //   title: "ContactUs",
  //   url: "/Admin/ContactUs",
  //   icon: ImageIcon,
  // },
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-white">
      <SidebarHeader>
        <Image
          className="h-20 object-cover mx-auto border-gray-600 p-2 border-2 rounded-xl"
          src="/logo/1.png"
          alt="CarBuyDirect logo"
          width={500}
          height={500}
          priority
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className='hover:translate-x-2 transform transition-all duration-300'>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/admin/logout">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

