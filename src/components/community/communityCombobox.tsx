"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { UseFormReturn } from "react-hook-form"

const communities = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "api_test",
    label: "API_TEST"
  },
]

export function CommunityCombobox({ 
    form, 
    formFieldName 
}: { 
    form: UseFormReturn<any>,
    formFieldName: string;
}) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const t = useTranslations("Components.CommunityCombobox");

    React.useEffect(() => {
        form.setValue(`${formFieldName}`, value);
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between rounded-l-none"
                >
                    {value
                        ? communities.find((community) => community.value === value)?.label
                        : t("SelectCommunity")}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder={t("SearchCommunities")} className="h-9" />
                    <CommandList>
                        <CommandEmpty>{t("NoCommunityFound")}</CommandEmpty>
                        <CommandGroup>
                            {communities.map((community) => (
                                <CommandItem
                                    key={community.value}
                                    value={community.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {community.label}
                                    <Check
                                        className={cn(
                                        "ml-auto",
                                        value === community.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}