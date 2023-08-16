import { component$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChannelType } from "discord-api-types/v10";
import {
  FolderOutline,
} from "qwik-ionicons";
import { MenuTitle } from "~/components/Menu";
import { Button } from "~/components/elements/Button";
import Card, { CardHeader } from "~/components/elements/Card";
import SelectInput from "~/components/elements/SelectInput";
import SettingsMenu from "~/components/elements/SettingsMenu";
import TextInput from "~/components/elements/TextInput";
import type { guildData } from "~/components/functions/guildData";
import { updateSettingFn } from "~/components/functions/guildData";
import { useGetGuildData } from "~/routes/layout-required";

export default component$(() => {
  const guildData = useGetGuildData().value;
  const store = useStore({
    guildData,
    loading: [] as string[],
  });

  if (store.guildData instanceof Error) {
    return (
      <div class="flex flex-col gap-3 items-center justify-center h-full pt-24">
        <h1 class="text-4xl font-bold">Error</h1>
        <p class="text-xl">{(guildData as Error).message}</p>
        <Button onClick$={() => location.reload()} color="danger">
          Reload
        </Button>
      </div>
    );
  }

  const { guild, channels, roles, srvconfig } = store.guildData as guildData;

  return (
    <section class="grid gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 mx-auto max-w-screen-2xl px-4 sm:px-6 min-h-[calc(100lvh-80px)]">
      <SettingsMenu guild={guild} store={store} />
      <div class="sm:col-span-2 lg:col-span-3 2x1:col-span-4 pt22 sm:pt-28">
        <MenuTitle>General Settings</MenuTitle>
        <div class="flex flex-wrap gap-4 py-10">
          <Card fit>
            <CardHeader id="membercount" loading={store.loading.includes("membercount")}>
              <FolderOutline width="25" class="fill-current" /> Member Count Channel
            </CardHeader>
            <SelectInput id="membercount-channel-input" label="The channel to use as a member count" onChange$={async (event: any) => {
              store.loading.push("membercount");
              srvconfig!.membercount.channel = event.target.value;
              await updateSettingFn("membercount", JSON.stringify(srvconfig?.membercount));
              store.loading = store.loading.filter((l) => l != "membercount");
            }}
            >
              <option value="false" selected={srvconfig!.membercount.channel == "false"}> None </option>
              {channels.map((c) => (
                <option value={c.id} key={c.id} selected={srvconfig!.membercount.channel == c.id}>{`- ${c.name}`}</option>
              ))}
            </SelectInput>
            <TextInput id="membercount-text-input" value={srvconfig!.membercount.text} placeholder="Members: {COUNT}" onChange$={async (event: any) => {
              store.loading.push("membercount");
              srvconfig!.membercount.text = event.target.value;
              await updateSettingFn("membercount", JSON.stringify(srvconfig?.membercount));
              store.loading = store.loading.filter((l) => l != "membercount");
            }}
            >
              Channel Name
            </TextInput>
            <p>
              <code>{"{COUNT}"}</code> gets replaced with the member count
            </p>
          </Card>
          <Card fit>
            <CardHeader id="countingchannel" loading={store.loading.includes("countingchannel")}>
              <FolderOutline width="25" class="fill-current" /> Counting Channel
            </CardHeader>
            <SelectInput id="countingchannel-input" label="The channel to let people count in" onChange$={async (event: any) => {
              store.loading.push("countingchannel");
              srvconfig!.counting.channel = event.target.value;
              await updateSettingFn("counting", event.target.value);
              store.loading = store.loading.filter((l) => l != "countingchannel");
            }}
            >
              <option value="false" selected={srvconfig!.counting.channel == "false"}> None </option>
              {channels
                .filter((c) => c.type == ChannelType.GuildText).map((c) => (
                  <option value={c.id} key={c.id} selected={srvconfig!.counting.channel == c.id}>{`- ${c.name}`}</option>
                ))}
            </SelectInput>
          </Card>
          <Card fit>
            <CardHeader id="staffrole" loading={store.loading.includes("staffrole")}>
              <FolderOutline width="25" class="fill-current" /> Staff Role
            </CardHeader>
            <SelectInput id="staffrole-input" label="The role for staff command access" onChange$={async (event: any) => {
              store.loading.push("staffrole");
              srvconfig!.staffRole = event.target.value;
              await updateSettingFn("staffRole", event.target.value);
              store.loading = store.loading.filter((l) => l != "staffrole");
            }} style={{
              color: '#' + (roles.find(r => r.id == srvconfig?.staffRole)?.color ? roles.find(r => r.id == srvconfig?.staffRole)?.color.toString(16) : 'ffffff')
            }}
            >
              <option value="false" selected={srvconfig?.staffRole == "false"} style={{ color: '#ffffff' }}> Only people with administrator permission </option>
              {
                roles.map(r =>
                  < option value={r.id} key={r.id} selected={srvconfig?.staffRole == r.id} style={{ color: '#' + (r.color ? r.color.toString(16) : 'ffffff') }}>{`@ ${r.name}`}</option>
                )
              }
            </SelectInput>
          </Card>
        </div>
      </div>
    </section >
  );
});

export const head: DocumentHead = {
  title: "General Settings",
  meta: [
    {
      name: "description",
      content: "Lumin General Server Settings",
    },
    {
      property: "og:description",
      content: "Lumin General Server Settings",
    },
  ],
};