"use client";

import Alert, { AlertSubtitle, AlertTitle } from "@/components/alert/alert";
import Button from "@/components/button/button";
import ButtonGroup from "@/components/button/buttonGroup";
import DialogExample from "@/components/examples/DialogExample";
import Menu, {
    MenuButton,
    MenuContent,
    MenuItem,
    MenuLink,
    MenuTrigger
} from "@/components/menu/menu";
import Typography from "@/components/misc/typography";
import PageHeading from "@/components/navigation/pageHeading";
import SegmentedControl from "@/components/segmentedControl/segmentedControl";
import Select, { Option, SelectContent } from "@/components/select/select";
import Table from "@/components/table/table";
import { TabContent, Tabs } from "@/components/tabs/tabs";
import { createToast } from "@/components/toast/toast";
import {
    ArchiveBoxIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon,
    BellIcon,
    BoltIcon,
    CheckIcon,
    ChevronDownIcon,
    CogIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    ListBulletIcon,
    NoSymbolIcon,
    UserPlusIcon,
    ViewColumnsIcon,
    XMarkIcon,
} from "@heroicons/react/16/solid";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function UITestPage() {

	const t = useTranslations("/dev/ui");
	const [sort, setSort] = useState<string>(t("Select.Values.Hot"));

	// createToast({ variant: "Notice", title: "Uh oh! Something went wrong.", description: "There was a problem with your request.", buttons: <><Button variant="Secondary" onClick={() => void(0)} icon={<ArrowPathIcon />}>Retry</Button> <Button variant="Secondary" onClick={() => void(0)} icon={<XMarkIcon />}>Cancel</Button></> })

  	return (
		<div>
		  	<PageHeading title={t("Title")} />
			<div>
				<main className="pageMain">
					<Typography variant="h2" className="mb-2" id={t("Alerts.Alerts")}>{t("Alerts.Alerts")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12">
						<Alert variant={"notice"}>
							<AlertTitle>{t("Alerts.NoticeAlert.Title")}</AlertTitle>
							<AlertSubtitle>{t("Alerts.NoticeAlert.Subtitle")}</AlertSubtitle>
						</Alert>
						<Alert variant={"warning"} className="mt-2">
							<AlertTitle>{t("Alerts.WarningAlert.Title")}</AlertTitle>
							<AlertSubtitle>{t("Alerts.WarningAlert.Subtitle")}</AlertSubtitle>
						</Alert>
						<Alert variant={"error"} className="mt-2">
							<AlertTitle>{t("Alerts.ErrorAlert.Title")}</AlertTitle>
							<AlertSubtitle>{t("Alerts.ErrorAlert.Subtitle")}</AlertSubtitle>
						</Alert>
						<Alert variant={"success"} className="mt-2">
							<AlertTitle>{t("Alerts.SuccessAlert.Title")}</AlertTitle>
							<AlertSubtitle>{t("Alerts.SuccessAlert.Subtitle")}</AlertSubtitle>
						</Alert>
						<Typography variant="p" className="mt-2 mb-2">No Subtitle</Typography>
						<Alert variant={"error"}>
							<AlertTitle>{t("Alerts.NoSubtitleAlert.Title")}</AlertTitle>
						</Alert>
						<Typography variant="p" className="mt-2 mb-2">No Close Button</Typography>
						<Alert variant={"warning"} closeBtn={false}>
							<AlertTitle>{t("Alerts.NoCloseButtonAlert.Title")}</AlertTitle>
						</Alert>
					</div>

					<Typography variant="h2" className="mb-2">{t("Buttons.Buttons")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12">
						<Typography variant="p" className="mb-2">{t("Buttons.Buttons")}</Typography>
						<div className="border-1 border-border border-dashed p-4 rounded-sm mb-4">
							<div className="flex flex-col md:flex-row gap-2">
								<Button variant="Primary">{t("Buttons.MainButton")}</Button>
								<Button variant="Secondary">{t("Buttons.SecondaryButton")}</Button>
								<Button variant="Destructive">{t("Buttons.DestructiveButton")}</Button>
								<Button variant="Ghost">{t("Buttons.GhostButton")}</Button>							
							</div>
						</div>
						<Typography variant="p" className="mb-2">{t("Buttons.ButtonsDisabled")}</Typography>
						<div className="border-1 border-border border-dashed p-4 rounded-sm mb-4">
							<div className="flex flex-col md:flex-row gap-2">
								<Button variant="Primary" disabled={true}>{t("Buttons.MainButton")}</Button>
								<Button variant="Secondary" disabled={true}>{t("Buttons.SecondaryButton")}</Button>
								<Button variant="Destructive" disabled={true}>{t("Buttons.DestructiveButton")}</Button>
								<Button variant="Ghost" disabled={true}>{t("Buttons.GhostButton")}</Button>
							</div>
						</div>
						<Typography variant="p" className="mb-2">{t("Buttons.ButtonsLoading")}</Typography>
						<div className="border-1 border-border border-dashed p-4 rounded-sm mb-4">
							<div className="flex flex-col md:flex-row gap-2">
								<Button variant="Primary" loading={true}>{t("Buttons.MainButton")}</Button>
								<Button variant="Secondary" loading={true}>{t("Buttons.SecondaryButton")}</Button>
								<Button variant="Destructive" loading={true}>{t("Buttons.DestructiveButton")}</Button>
								<Button variant="Ghost" loading={true}>{t("Buttons.GhostButton")}</Button>
							</div>
						</div>

						<Typography variant="p" className="mb-2">{t("Buttons.ButtonsIcons")}</Typography>
						<div className="border-1 border-border border-dashed p-4 rounded-sm mb-4">
							<div className="flex flex-col md:flex-row gap-2">
								<Button variant="Primary" icon={<CogIcon />}>{t("Buttons.MainButton")}</Button>
								<Button variant="Secondary" icon={<CogIcon />}>{t("Buttons.SecondaryButton")}</Button>
								<Button variant="Destructive" icon={<CogIcon />}>{t("Buttons.DestructiveButton")}</Button>
								<Button variant="Ghost" icon={<CogIcon />}>{t("Buttons.GhostButton")}</Button>
							</div>
						</div>
					</div>

					<Typography variant="h2" className="mb-2" id={t("Buttons.ButtonGroup")}>{t("Buttons.ButtonGroup")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12">
						<ButtonGroup>
							<Button variant="Secondary" icon={<UserPlusIcon />}>Follow</Button>
							<Button variant="Secondary">Ignore</Button>
							{/*<Button variant="Secondary" icon={<ChevronDownIcon />} square />*/}
							<Menu defaultPlacement="bottom">
								<MenuTrigger><Button variant="Secondary" icon={<ChevronDownIcon />} square className="!rounded-sm-l-none !border-l-0" /></MenuTrigger>
								<MenuContent>
									<MenuItem icon={<NoSymbolIcon />}>Block</MenuItem>
									<MenuItem icon={<ExclamationCircleIcon />}>Report</MenuItem>
								</MenuContent>
							</Menu>
						</ButtonGroup>
					</div>

					<Typography variant="h2" className="mb-2" id="SegmentedControl">Segmented Control</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12">
						<SegmentedControl onChange={() => void(0)}>
							<Button variant="Secondary" icon={<ViewColumnsIcon />} />
							<Button variant="Secondary" icon={<ListBulletIcon />} />
						</SegmentedControl>
					</div>

					<Typography variant="h2" className="mb-2" id={t("Dialog.Dialog")}>{t("Dialog.Dialog")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12 flex flex-col md:flex-row gap-4">
						<DialogExample />
					</div>

					<Typography variant="h2" className="mb-2" id={t("Menus.Menus")}>{t("Menus.Menus")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12 flex gap-4 flex-col md:flex-row">
						<Menu defaultPlacement="bottom-start">
						<MenuTrigger><Button variant="Secondary">{t("Menus.TriggerMenu.Trigger")}</Button></MenuTrigger>
						<MenuContent>
							<MenuLink link={"#"}>{t("Menus.TriggerMenu.Link")}</MenuLink>
							<MenuLink link={"#"} icon={<BoltIcon />}>{t("Menus.TriggerMenu.LinkWithIcon")}</MenuLink>
							<MenuLink link={"#"} endIcon={<CheckIcon />}>{t("Menus.TriggerMenu.LinkWithIconAtEnd")}</MenuLink>
							<hr />
							<MenuButton onClick={() => void(0)}>{t("Menus.TriggerMenu.Button")}</MenuButton>
							<MenuButton onClick={() => void(0)} icon={<BoltIcon />}>{t("Menus.TriggerMenu.ButtonWithIcon")}</MenuButton>
							<MenuButton onClick={() => void(0)} endIcon={<CheckIcon />}>{t("Menus.TriggerMenu.ButtonWithIconAtEnd")}</MenuButton>
							<hr />
							<MenuButton onClick={() => void(0)} shortcut={"Ctrl + C"}>{t("Menus.TriggerMenu.ButtonWithShortcutText")}</MenuButton>
						</MenuContent>
						</Menu>
						<Menu defaultPlacement="bottom-start">
							<MenuTrigger><Button variant="Secondary">{t("Menus.ImageMenu.Image")}</Button></MenuTrigger>
							<MenuContent>
								<MenuLink link={"#"} icon={<ArrowDownTrayIcon />}>{t("Menus.ImageMenu.SaveImage")}</MenuLink>
								<MenuLink link={"#"} icon={<ExclamationCircleIcon />}>{t("Menus.ImageMenu.ReportImage")}</MenuLink>
								<hr />
								<MenuLink link={"#"} icon={<DocumentTextIcon />}>{t("Menus.ImageMenu.Metadata")}</MenuLink>
							</MenuContent>
						</Menu>
					</div>

					<Typography variant="h2" className="mb-2" id={t("Select.Select")}>{t("Select.Select")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12 flex flex-col md:flex-row">
						<Select onSelect={setSort} defaultSelection={sort} label={t("Select.Sort")}>
							<SelectContent>
							<Option label={t("Select.Values.Hot")} />
							<Option label={t("Select.Values.New")} />
							<Option label={t("Select.Values.Old")} />
							<Option label={t("Select.Values.Top")} />
							<Option label={t("Select.Values.Controversial")} />
							<Option label={t("Select.Values.Comments")} />
							</SelectContent>
						</Select>
						<Typography variant="p" className="mt-2">{t("Select.SelectedValue")}: {sort}</Typography>
					</div>

					<Typography variant="h2" className="mb-2" id={t("Tables.Tables")}>{t("Tables.Tables")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12 flex gap-4 flex-col md:flex-row">
						<Table fullWidth={false}>
							<thead>
								<tr>
									<th>{t("Tables.MetadataTable.Filename")}</th>
									<td>image.png</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.Title")}</th>
									<td>My Example Image</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.Description")}</th>
									<td>N/A</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.CreatedAt")}</th>
									<td>2024-10-06T12:34:56Z</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.Camera")}</th>
									<td>Canon EOS R5</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.ExposureTime")}</th>
									<td>1/1000</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.Aperture")}</th>
									<td>f/5.6</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.FocalLength")}</th>
									<td>50mm</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.ISO")}</th>
									<td>100</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.Latitude")}</th>
									<td>40.712776</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.Longitude")}</th>
									<td>-74.005974</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.Width")}</th>
									<td>1920</td>
								</tr>
								<tr>
									<th>{t("Tables.MetadataTable.Height")}</th>
									<td>1080</td>
								</tr>
							</thead>
						</Table>
						<Table fullWidth={false}>
							<thead>
								<tr>
									<th>{t("Tables.BannedUsersTable.User")}</th>
									<th>{t("Tables.BannedUsersTable.Reason")}</th>
									<th>{t("Tables.BannedUsersTable.Until")}</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>JamsterJava</td>
									<td>{t("Tables.BannedUsersTable.Reasons.Spam")}</td>
									<td>23/10/2024</td>
								</tr>
								<tr>
									<td>Username50</td>
									<td>{t("Tables.BannedUsersTable.Reasons.Harassment")}</td>
									<td>25/10/2024</td>
								</tr>
								<tr>
									<td>ILoveTacosThatAreDeliciousAndTasty</td>
									<td>{t("Tables.BannedUsersTable.Reasons.Spam")}</td>
									<td>{t("Tables.BannedUsersTable.Permanently")}</td>
								</tr>
							</tbody>
						</Table>
					</div>

					<Typography variant="h2" className="mb-2" id={t("Tabs.Tabs")}>{t("Tabs.Tabs")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12 flex gap-4 flex-col">
						<Typography variant="p">{t("Tabs.Filled")}</Typography>
						<div className="flex flex-row gap-4 w-full border-1 border-border border-dashed p-4 rounded-sm mb-12">
							<Tabs>
								<TabContent label="Inbox"><Typography variant="p">{t("Tabs.Inbox")}</Typography></TabContent>
								<TabContent label="Archived"><Typography variant="p">{t("Tabs.Archived")}</Typography></TabContent>
								<TabContent label="All"><Typography variant="p">{t("Tabs.All")}</Typography></TabContent>
							</Tabs>
							<hr />
							<Tabs>
								<TabContent label="Inbox" icon={<EnvelopeIcon />}><Typography variant="p">{t("Tabs.Inbox")}</Typography></TabContent>
								<TabContent label="Archived" icon={<ArchiveBoxIcon />}><Typography variant="p">{t("Tabs.Archived")}</Typography></TabContent>
								<TabContent label="All"><Typography variant="p">{t("Tabs.All")}</Typography></TabContent>
							</Tabs>
							<hr />
							<Tabs>
								<TabContent label="Tab 1"><Typography variant="p">{t("Tabs.Tab")} 1</Typography></TabContent>
								<TabContent label="Tab 2"><Typography variant="p">{t("Tabs.Tab")} 2</Typography></TabContent>
								<TabContent label="Tab 3"><Typography variant="p">{t("Tabs.Tab")} 3</Typography></TabContent>
								<TabContent label="Tab 4"><Typography variant="p">{t("Tabs.Tab")} 4</Typography></TabContent>
							</Tabs>						
						</div>
						<Typography variant="p">{t("Tabs.Underlined")}</Typography>
						<div className="flex flex-row gap-4 w-full border-1 border-border border-dashed p-4 rounded-sm">
							<Tabs style="underlined">
								<TabContent label="Inbox"><Typography variant="p">{t("Tabs.Inbox")}</Typography></TabContent>
								<TabContent label="Archived"><Typography variant="p">{t("Tabs.Archived")}</Typography></TabContent>
								<TabContent label="All"><Typography variant="p">{t("Tabs.All")}</Typography></TabContent>
							</Tabs>
							<hr />
							<Tabs style="underlined">
								<TabContent label="Inbox" icon={<EnvelopeIcon />}><Typography variant="p">{t("Tabs.Inbox")}</Typography></TabContent>
								<TabContent label="Archived" icon={<ArchiveBoxIcon />}><Typography variant="p">{t("Tabs.Archived")}</Typography></TabContent>
								<TabContent label="All"><Typography variant="p">{t("Tabs.All")}</Typography></TabContent>
							</Tabs>
							<hr />
							<Tabs style="underlined">
								<TabContent label="Tab 1"><Typography variant="p">{t("Tabs.Tab")} 1</Typography></TabContent>
								<TabContent label="Tab 2"><Typography variant="p">{t("Tabs.Tab")} 2</Typography></TabContent>
								<TabContent label="Tab 3"><Typography variant="p">{t("Tabs.Tab")} 3</Typography></TabContent>
								<TabContent label="Tab 4"><Typography variant="p">{t("Tabs.Tab")} 4</Typography></TabContent>
							</Tabs>						
						</div>
						<Typography variant="p">{t("Tabs.FilledGhost")}</Typography>
						<div className="flex flex-row gap-4 w-full border-1 border-border border-dashed p-4 rounded-sm">
							<Tabs style="filled-ghost">
								<TabContent label="Inbox"><Typography variant="p">{t("Tabs.Inbox")}</Typography></TabContent>
								<TabContent label="Archived"><Typography variant="p">{t("Tabs.Archived")}</Typography></TabContent>
								<TabContent label="All"><Typography variant="p">{t("Tabs.All")}</Typography></TabContent>
							</Tabs>
							<hr />
							<Tabs style="filled-ghost">
								<TabContent label="Inbox" icon={<EnvelopeIcon />}><Typography variant="p">{t("Tabs.Inbox")}</Typography></TabContent>
								<TabContent label="Archived" icon={<ArchiveBoxIcon />}><Typography variant="p">{t("Tabs.Archived")}</Typography></TabContent>
								<TabContent label="All"><Typography variant="p">{t("Tabs.All")}</Typography></TabContent>
							</Tabs>
							<hr />
							<Tabs style="filled-ghost">
								<TabContent label="Tab 1"><Typography variant="p">{t("Tabs.Tab")} 1</Typography></TabContent>
								<TabContent label="Tab 2"><Typography variant="p">{t("Tabs.Tab")} 2</Typography></TabContent>
								<TabContent label="Tab 3"><Typography variant="p">{t("Tabs.Tab")} 3</Typography></TabContent>
								<TabContent label="Tab 4"><Typography variant="p">{t("Tabs.Tab")} 4</Typography></TabContent>
							</Tabs>
						</div>
						<Typography variant="p">Pills</Typography>
						<div className="flex flex-row gap-4 w-full border-1 border-border border-dashed p-4 rounded-sm">
							<Tabs style="pills">
								<TabContent label="Inbox"><Typography variant="p">{t("Tabs.Inbox")}</Typography></TabContent>
								<TabContent label="Archived"><Typography variant="p">{t("Tabs.Archived")}</Typography></TabContent>
								<TabContent label="All"><Typography variant="p">{t("Tabs.All")}</Typography></TabContent>
							</Tabs>
							<hr />
							<Tabs style="pills">
								<TabContent label="Inbox" icon={<EnvelopeIcon />}><Typography variant="p">{t("Tabs.Inbox")}</Typography></TabContent>
								<TabContent label="Archived" icon={<ArchiveBoxIcon />}><Typography variant="p">{t("Tabs.Archived")}</Typography></TabContent>
								<TabContent label="All"><Typography variant="p">{t("Tabs.All")}</Typography></TabContent>
							</Tabs>
							<hr />
							<Tabs style="pills">
								<TabContent label="Tab 1"><Typography variant="p">{t("Tabs.Tab")} 1</Typography></TabContent>
								<TabContent label="Tab 2"><Typography variant="p">{t("Tabs.Tab")} 2</Typography></TabContent>
								<TabContent label="Tab 3"><Typography variant="p">{t("Tabs.Tab")} 3</Typography></TabContent>
								<TabContent label="Tab 4"><Typography variant="p">{t("Tabs.Tab")} 4</Typography></TabContent>
							</Tabs>
						</div>
					</div>

					<Typography variant="h2" className="mb-2" id={t("Toasts.Toasts")}>{t("Toasts.Toasts")}</Typography>
					<div className="border-1 border-border border-dashed p-4 rounded-sm mb-12 flex gap-4 flex-col md:flex-row">
						<Button 
							variant="Secondary" 
							onClick={
								() => createToast({ 
									variant: "Notice", 
									title: t("Toasts.Types.Notice"), 
									description: t("Toasts.Messages.Descriptions.NoticeToast") 
							})} 
							icon={<BellIcon />}
						>
							{t("Toasts.Types.Notice")}
						</Button>
						<Button 
							variant="Secondary" 
							onClick={
								() => createToast({ 
									variant: "Warning", 
									title: t("Toasts.Types.Warning"), 
									description: t("Toasts.Messages.Descriptions.WarningToast") 
							})} 
							icon={<ExclamationTriangleIcon />}
						>
							{t("Toasts.Types.Warning")}
						</Button>
						<Button 
							variant="Secondary" 
							onClick={
								() => createToast({ 
									variant: "Success", 
									title: t("Toasts.Types.Success"), 
									description: t("Toasts.Messages.Descriptions.SuccessToast") 
							})}
							icon={<CheckIcon />}
						>
							{t("Toasts.Types.Success")}
						</Button>
						<Button 
							variant="Secondary" 
							onClick={
								() => createToast({ 
									variant: "Error", 
									title: t("Toasts.Types.Error"), 
									description: t("Toasts.Messages.Descriptions.ErrorToast") 
							})}
							icon={<ExclamationCircleIcon />}
						>
							{t("Toasts.Types.Error")}
						</Button>
						<Button 
							variant="Secondary" 
							onClick={
								() => createToast({ 
									variant: "Error", 
									title: t("Toasts.Messages.Titles.PostCreationFailed"), 
									description: t("Toasts.Messages.Descriptions.PostCreationFailed"), 
									buttons: <Button variant="Primary" onClick={() => createToast({ variant: "Error", title: t("Toasts.Messages.Titles.PostCreationFailed"), description: t("Toasts.Messages.Descriptions.RetryFailed") })} icon={<ArrowPathIcon />}>Retry</Button> 
							})} 
							icon={<ExclamationCircleIcon />}
						>
							{t("Toasts.Types.Example")}
						</Button>
						<Button 
							variant="Secondary" 
							onClick={() => createToast({
								promise: { 
									promise: new Promise<void>((resolve) => { setTimeout(() => resolve(), 5000) }),
									success: {
										variant: "Success",
										title: "Post created successfully.",
										description: "You will now be redirected.",
									},
									error: {
										variant: "Error",
										title: "Something went wrong.",
										description: "There was a problem while creating your post. Please try again.",
									},
									loading: {
										variant: "Notice",
										title: "Creating post...",
										description: "Please wait while your post is being created.",
									}
								}, 
								variant: "Notice", 
								title: "Uh oh! Something went wrong.", 
								description: "There was a problem with your request.", 
								buttons: 
									<>
										<Button variant="Secondary" onClick={() => void(0)} icon={<ArrowPathIcon />}>Retry</Button> 
										<Button variant="Secondary" onClick={() => void(0)} icon={<XMarkIcon />}>Cancel</Button>
									</>
							})} 
							icon={<CogIcon />}
						>
							{t("Toasts.Types.LoadingToast")}
						</Button>
					</div>

					<div className="flex gap-2">
						<div className="w-10 h-10 bg-new-grey-100 rounded-lg" />
						<div className="w-10 h-10 bg-new-grey-200 rounded-lg" />
						<div className="w-10 h-10 bg-new-grey-300 rounded-lg" />
						<div className="w-10 h-10 bg-new-grey-400 rounded-lg" />
						<div className="w-10 h-10 bg-new-grey-500 rounded-lg" />
						<div className="w-10 h-10 bg-new-grey-600 rounded-lg" />
						<div className="w-10 h-10 bg-new-grey-700 rounded-lg" />
						<div className="w-10 h-10 bg-new-grey-800 rounded-lg" />
						<div className="w-10 h-10 bg-new-grey-900 rounded-lg" />
					</div>
				</main>				
			</div>
		</div>
	);
}