import { describe, it, expect } from 'vitest';
import {
  createContactDTO,
  createConversationDTO,
  createMessageDTO,
  createAgentDTO,
  createTeamDTO,
  createReportCriteriaDTO,
  ChatwootManager,
  ConversationStatus,
  ConversationPriority,
  ReportType,
} from '../src/index.js';

describe('DTOs', () => {
  it('createContactDTO creates immutable object', () => {
    const dto = createContactDTO({ name: 'John', email: 'john@test.com' });
    expect(dto.name).toBe('John');
    expect(dto.email).toBe('john@test.com');
    expect(dto.phoneNumber).toBeUndefined();
  });

  it('createConversationDTO has defaults', () => {
    const dto = createConversationDTO({ inboxId: 1 });
    expect(dto.inboxId).toBe(1);
    expect(dto.status).toBeNull();
  });

  it('createMessageDTO has defaults', () => {
    const dto = createMessageDTO({ content: 'Hi' });
    expect(dto.content).toBe('Hi');
    expect(dto.messageType).toBe('outgoing');
    expect(dto.private).toBe(false);
    expect(dto.attachments).toEqual([]);
  });

  it('createAgentDTO has role default', () => {
    const dto = createAgentDTO({ email: 'a@b.com', name: 'Agent' });
    expect(dto.role).toBe('agent');
  });

  it('createTeamDTO has defaults', () => {
    const dto = createTeamDTO({ name: 'Support' });
    expect(dto.description).toBeNull();
    expect(dto.allowAutoAssign).toBeNull();
  });

  it('createReportCriteriaDTO has defaults', () => {
    const dto = createReportCriteriaDTO();
    expect(dto.since).toBeNull();
    expect(dto.until).toBeNull();
    expect(dto.type).toBeNull();
  });

  it('createReportCriteriaDTO with Date', () => {
    const since = new Date('2024-01-01');
    const dto = createReportCriteriaDTO({ since, type: ReportType.ACCOUNT });
    expect(dto.since).toBe(since);
    expect(dto.type).toBe(ReportType.ACCOUNT);
  });
});

describe('Enums', () => {
  it('ConversationStatus values', () => {
    expect(ConversationStatus.OPEN).toBe('open');
    expect(ConversationStatus.RESOLVED).toBe('resolved');
  });

  it('ConversationPriority values', () => {
    expect(ConversationPriority.URGENT).toBe('urgent');
  });

  it('ReportType values', () => {
    expect(ReportType.INBOX).toBe('inbox');
    expect(ReportType.TEAM).toBe('team');
  });
});

describe('ChatwootManager', () => {
  const config = {
    accounts: {
      default: { baseUrl: 'https://test.com', accountId: '1', apiAccessToken: 'tok' },
      secondary: { baseUrl: 'https://test2.com', accountId: '2', apiAccessToken: 'tok2' },
    },
  };

  it('throws for unknown account', () => {
    const mgr = new ChatwootManager({ accounts: {} });
    expect(() => mgr.account('nonexistent')).toThrow('Chatwoot account [nonexistent] is not defined.');
  });

  it('uses default account name', () => {
    const mgr = new ChatwootManager(config);
    expect(mgr.getDefaultAccount()).toBe('default');
  });

  it('uses custom default name', () => {
    const mgr = new ChatwootManager({ default: 'secondary', accounts: config.accounts });
    expect(mgr.getDefaultAccount()).toBe('secondary');
  });
});

describe('ChatwootFake', () => {
  const emptyConfig = {
    accounts: {
      default: { baseUrl: '', accountId: '', apiAccessToken: '' },
    },
  };

  it('records message sends', async () => {
    const mgr = new ChatwootManager(emptyConfig);
    const fake = mgr.fake();

    await mgr.sendMessage(10, createMessageDTO({ content: 'test' }));

    fake.assertMessageSent((msg, convId) => {
      return msg.content === 'test' && convId === 10;
    });
  });

  it('fails assertion when no message sent', () => {
    const mgr = new ChatwootManager(emptyConfig);
    const fake = mgr.fake();

    expect(() => {
      fake.assertMessageSent(() => true);
    }).toThrow('The expected message was not sent.');
  });

  it('records contact creation', async () => {
    const mgr = new ChatwootManager(emptyConfig);
    const fake = mgr.fake();

    await mgr.createContact(createContactDTO({ name: 'Test', email: 't@t.com' }));

    fake.assertContactCreated((dto) => dto.name === 'Test' && dto.email === 't@t.com');
  });

  it('records file sends', async () => {
    const mgr = new ChatwootManager(emptyConfig);
    const fake = mgr.fake();

    await mgr.sendFile(5, 'file-content', 'caption');

    fake.assertFileSent((file, convId, content) => {
      return file === 'file-content' && convId === 5 && content === 'caption';
    });
  });

  it('records conversation updates', async () => {
    const mgr = new ChatwootManager(emptyConfig);
    const fake = mgr.fake();

    await mgr.updateConversation(3, createConversationDTO({ status: ConversationStatus.RESOLVED }));

    fake.assertConversationUpdated((dto, id) => {
      return dto.status === ConversationStatus.RESOLVED && id === 3;
    });
  });

  it('getFake returns fake instance', () => {
    const mgr = new ChatwootManager(emptyConfig);
    mgr.fake();
    expect(mgr.getFake()).not.toBeNull();
  });

  it('getFake returns null without fake', () => {
    const mgr = new ChatwootManager(emptyConfig);
    expect(mgr.getFake()).toBeNull();
  });

  it('fake proxies all calls to fake', async () => {
    const mgr = new ChatwootManager(emptyConfig);
    const fake = mgr.fake();

    await mgr.getContacts();
    await mgr.getAgents();
    await mgr.getLabels();

    const history = fake.getCallHistory();
    expect(history.some((c) => c.method === 'getContacts')).toBe(true);
    expect(history.some((c) => c.method === 'getAgents')).toBe(true);
    expect(history.some((c) => c.method === 'getLabels')).toBe(true);
  });

  it('findCall filters correctly', async () => {
    const mgr = new ChatwootManager(emptyConfig);
    const fake = mgr.fake();

    await mgr.sendMessage(1, createMessageDTO({ content: 'a' }));
    await mgr.sendMessage(2, createMessageDTO({ content: 'b' }));

    const calls = fake.findCall('sendMessage');
    expect(calls).toHaveLength(2);
  });
});
