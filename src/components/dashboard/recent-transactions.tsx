import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "../ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const transactions = [
    { name: "Liam Johnson", email: "liam@example.com", type: "Verification", status: "Approved", amount: "+$25.00", avatarId: "user-avatar-1" },
    { name: "Olivia Smith", email: "olivia@example.com", type: "Registration", status: "Pending", amount: "+$150.00", avatarId: "user-avatar-2" },
    { name: "Noah Williams", email: "noah@example.com", type: "Translation", status: "Approved", amount: "+$5.50", avatarId: "user-avatar-3" },
    { name: "Emma Brown", email: "emma@example.com", type: "Verification", status: "Declined", amount: "-$25.00", avatarId: "user-avatar-1" },
]


export function RecentTransactions() {
  return (
    <Card>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transactions.map((transaction, index) => {
                    const avatar = PlaceHolderImages.find(p => p.id === transaction.avatarId);
                    return (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        {avatar && <AvatarImage src={avatar.imageUrl} alt="Avatar" data-ai-hint={avatar.imageHint} />}
                                        <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-0.5">
                                        <p className="font-medium">{transaction.name}</p>
                                        <p className="text-sm text-muted-foreground">{transaction.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">{transaction.amount}</TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  )
}
