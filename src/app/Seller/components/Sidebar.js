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
    url: "/Seller",
    icon: Home,
  },
  // {
  //   title: "User Management",
  //   url: "/Seller/Pages/UserManagement",
  //   icon: Users,
  // },
  // {
  //   title: "Brand Management",
  //   url: "/Seller/Pages/BrandManagement",
  //   icon: Building2,
  // },
  {
    title: "My Profile",
    url: "/Seller/Pages/profile",
    icon: CarFront,
  },
  {
    title: "Car Submissions",
    url: "/Seller/Pages/CarSubmission",
    icon: CarFront,
  },
  {
    title: "My Auctions",
    url: "/Seller/Pages/AuctionManagement",
    icon: Gavel,
  },
  {
    title: "Bidding",
    url: "/Seller/Pages/Bidding",
    icon: Banknote,
  },
  {
    title: "SoldOut",
    url: "/Seller/Pages/SoldOut",
    icon: ShoppingCart,
  },
  // {
  //   title: "Notifications",
  //   url: "/Seller/Pages/Notifications",
  //   icon: ShoppingCart,
  // },
  { 
    title: "Payment",
    url: "/Seller/Pages/Payment",
    icon: ImageIcon,
  },
  { 
    title: "History",
    url: "/Seller/Pages/History",
    icon: ImageIcon,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
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
          <Link href="/Seller/logout">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

