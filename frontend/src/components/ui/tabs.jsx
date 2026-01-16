import * as React from "react"
import { cn } from "../../lib/utils"

// Since I am not installing radix-ui/react-tabs right now to keep it simple without excessive dependencies if I can help it, 
// OR I should use a simple custom implementation for Tabs if I want to avoid installing more packages.
// GUIDELINE: "Use Vanilla CSS... Avoid using TailwindCSS unless USER explicitly requests...".
// Actually user accepted React+Vite+Tailwind in the plan.
// But I don't want to break the flow by installing radix-ui if I can make a simple version.
// Let's make a simple version that mimics the API used in Profile.jsx used so far.
// Profile uses: Tabs, TabsList, TabsTrigger, TabsContent

const Tabs = React.forwardRef(({ className, defaultValue, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)

    // Clone children to pass down activeTab state if needed, or use Context.
    // Context is better.
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div ref={ref} className={cn("", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
})
Tabs.displayName = "Tabs"

const TabsContext = React.createContext({})

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, onClick, ...props }, ref) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                activeTab === value ? "bg-background text-foreground shadow-sm" : "hover:bg-muted/50",
                className
            )}
            onClick={(e) => {
                setActiveTab(value);
                if (onClick) onClick(e);
            }}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, ...props }, ref) => {
    const { activeTab } = React.useContext(TabsContext)
    if (activeTab !== value) return null;
    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
