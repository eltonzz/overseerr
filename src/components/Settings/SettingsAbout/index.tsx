import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import useSWR from 'swr';
import {
  SettingsAboutResponse,
  StatusResponse,
} from '../../../../server/interfaces/api/settingsInterfaces';
import globalMessages from '../../../i18n/globalMessages';
import Error from '../../../pages/_error';
import Alert from '../../Common/Alert';
import Badge from '../../Common/Badge';
import List from '../../Common/List';
import LoadingSpinner from '../../Common/LoadingSpinner';
import PageTitle from '../../Common/PageTitle';
import Releases from './Releases';

const messages = defineMessages({
  about: 'About',
  overseerrinformation: 'About Overseerr',
  version: 'Version',
  totalmedia: 'Total Media',
  totalrequests: 'Total Requests',
  gettingsupport: 'Getting Support',
  githubdiscussions: 'GitHub Discussions',
  timezone: 'Time Zone',
  supportoverseerr: 'Support Overseerr',
  helppaycoffee: 'Help Pay for Coffee',
  documentation: 'Documentation',
  preferredmethod: 'Preferred',
  outofdate: 'Out of Date',
  uptodate: 'Up to Date',
  runningDevelop:
    'You are running the <code>develop</code> branch of Overseerr, which is only recommended for those contributing to development or assisting with bleeding-edge testing.',
});

const SettingsAbout: React.FC = () => {
  const intl = useIntl();
  const { data, error } = useSWR<SettingsAboutResponse>(
    '/api/v1/settings/about'
  );

  const { data: status } = useSWR<StatusResponse>('/api/v1/status');

  if (!data && !error) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return <Error statusCode={500} />;
  }

  return (
    <>
      <PageTitle
        title={[
          intl.formatMessage(messages.about),
          intl.formatMessage(globalMessages.settings),
        ]}
      />
      <div className="section">
        <List title={intl.formatMessage(messages.overseerrinformation)}>
          {data.version.startsWith('develop-') && (
            <Alert
              title={intl.formatMessage(messages.runningDevelop, {
                code: function code(msg) {
                  return <code className="bg-opacity-50">{msg}</code>;
                },
                GithubLink: function GithubLink(msg) {
                  return (
                    <a
                      href="https://github.com/sct/overseerr"
                      target="_blank"
                      rel="noreferrer"
                      className="text-yellow-100 underline transition duration-300 hover:text-white"
                    >
                      {msg}
                    </a>
                  );
                },
              })}
            />
          )}
          <List.Item
            title={intl.formatMessage(messages.version)}
            className="flex flex-row items-center truncate"
          >
            <code className="truncate">
              {data.version.replace('develop-', '')}
            </code>
            {status?.updateAvailable ? (
              <a
                href={`https://github.com/sct/overseerr/compare/${data.version.replace(
                  'develop-',
                  ''
                )}...develop`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  badgeType="warning"
                  className="ml-2 transition !cursor-pointer hover:bg-yellow-400"
                >
                  {intl.formatMessage(messages.outofdate)}
                </Badge>
              </a>
            ) : (
              status?.commitTag !== 'local' && (
                <a
                  href="https://github.com/sct/overseerr/commits/develop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge
                    badgeType="success"
                    className="ml-2 transition !cursor-pointer hover:bg-green-400"
                  >
                    {intl.formatMessage(messages.uptodate)}
                  </Badge>
                </a>
              )
            )}
          </List.Item>
          <List.Item title={intl.formatMessage(messages.totalmedia)}>
            {intl.formatNumber(data.totalMediaItems)}
          </List.Item>
          <List.Item title={intl.formatMessage(messages.totalrequests)}>
            {intl.formatNumber(data.totalRequests)}
          </List.Item>
          {data.tz && (
            <List.Item title={intl.formatMessage(messages.timezone)}>
              <code>{data.tz}</code>
            </List.Item>
          )}
        </List>
      </div>
      <div className="section">
        <List title={intl.formatMessage(messages.gettingsupport)}>
          <List.Item title={intl.formatMessage(messages.documentation)}>
            <a
              href="https://docs.overseerr.dev"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 transition duration-300 hover:underline"
            >
              https://docs.overseerr.dev
            </a>
          </List.Item>
          <List.Item title={intl.formatMessage(messages.githubdiscussions)}>
            <a
              href="https://github.com/sct/overseerr/discussions"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 transition duration-300 hover:underline"
            >
              https://github.com/sct/overseerr/discussions
            </a>
          </List.Item>
          <List.Item title="Discord">
            <a
              href="https://discord.gg/overseerr"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 transition duration-300 hover:underline"
            >
              https://discord.gg/overseerr
            </a>
          </List.Item>
        </List>
      </div>
      <div className="section">
        <List title={intl.formatMessage(messages.supportoverseerr)}>
          <List.Item
            title={`${intl.formatMessage(messages.helppaycoffee)} ☕️`}
          >
            <a
              href="https://github.com/sponsors/sct"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 transition duration-300 hover:underline"
            >
              https://github.com/sponsors/sct
            </a>
            <Badge className="ml-2">
              {intl.formatMessage(messages.preferredmethod)}
            </Badge>
          </List.Item>
          <List.Item title="">
            <a
              href="https://patreon.com/overseerr"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-500 transition duration-300 hover:underline"
            >
              https://patreon.com/overseerr
            </a>
          </List.Item>
        </List>
      </div>
      <div className="section">
        <Releases currentVersion={data.version} />
      </div>
    </>
  );
};

export default SettingsAbout;
