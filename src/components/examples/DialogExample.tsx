"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import Dialog, { DialogButtonContainer, DialogCloseButton, DialogContent, DialogTrigger } from "../dialog/dialog";
import Button, { ButtonTypes } from "../button/button";
import React from "react";
import TextInput from "../input/text_input";
import { useTranslations } from "next-intl";
import Select, { Option, SelectContent } from "../select/select";

export default function DialogExample() {

    const t = useTranslations("/dev/ui");

    const [iconEnabled, setIconEnabled] = React.useState<boolean>(false);
    const [closeBtnEnabled, setCloseBtnEnabled] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>("This is the title.");
    const [subtitle, setSubtitle] = React.useState<string>("This is the subtitle.");

    const [btn1Type, setBtn1Type] = React.useState<ButtonTypes>("Primary");
    const [btn1Text, setBtn1Text] = React.useState<string>("Okay");

    const [btn2Type, setBtn2Type] = React.useState<ButtonTypes>("Secondary");
    const [btn2Text, setBtn2Text] = React.useState<string>("Cancel");
    
    return (
        <form className="w-full">
            <div className="flex gap-1 items-center">
                <input name="IconEnabledCheckbox" id="IconEnabledCheckbox" type="checkbox" checked={iconEnabled} onChange={event => setIconEnabled(event.target.checked)} />
                <label htmlFor="IconEnabledCheckbox" className="text-secondary font-semibold text-sm">{t("Dialog.Customisation.IconEnabledCheckbox")}</label>  
            </div>
            <div className="flex gap-1 items-center mb-4">
                <input name="CloseBtnEnabledCheckbox" id="CloseBtnEnabledCheckbox" type="checkbox" checked={closeBtnEnabled} onChange={event => setCloseBtnEnabled(event.target.checked)} />
                <label htmlFor="CloseBtnEnabledCheckbox" className="text-secondary font-semibold text-sm">{t("Dialog.Customisation.CloseButtonEnabledCheckbox")}</label>  
            </div>

            <div className="flex flex-col gap-4">
                <TextInput label={t("Dialog.Customisation.Title")} value={title} onChange={event => setTitle(event.target.value)} />
                <TextInput label={t("Dialog.Customisation.Subtitle")} value={subtitle} onChange={event => setSubtitle(event.target.value)} />

                <Select onSelect={setBtn1Type} defaultSelection={btn1Type} label={t("Dialog.Customisation.Button1Type")}>
                    <SelectContent>
                        <Option label="Primary" />
                        <Option label="Secondary" />
                        <Option label="Destructive" />
                        <Option label="Ghost" />                        
                    </SelectContent>
                </Select>
                <Select onSelect={setBtn2Type} defaultSelection={btn2Type} label={t("Dialog.Customisation.Button2Type")}>
                    <SelectContent>
                        <Option label="Primary" />
                        <Option label="Secondary" />
                        <Option label="Destructive" />
                        <Option label="Ghost" />                        
                    </SelectContent>
                </Select>

                <TextInput label={t("Dialog.Customisation.Button1Text")} value={btn1Text} onChange={event => setBtn1Text(event.target.value)} />
                <TextInput label={t("Dialog.Customisation.Button2Text")} value={btn2Text} onChange={event => setBtn2Text(event.target.value)} />

                <Dialog closeButton={closeBtnEnabled} title={title} subtitle={subtitle} icon={iconEnabled}>
                    <DialogTrigger><Button variant="Primary">{t("Dialog.Customisation.TriggerButton")}</Button></DialogTrigger>
                    <DialogContent>
                        <DialogButtonContainer>
                            <DialogCloseButton><Button variant={btn2Type}>{btn2Text}</Button></DialogCloseButton>
                            <Button variant={btn1Type}>{btn1Text}</Button>
                        </DialogButtonContainer>
                    </DialogContent>
                </Dialog>                         
            </div>
        </form>
    );
}