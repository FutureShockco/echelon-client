import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

type OperationType =
    | 'transfer'
    | 'vote'
    | 'comment'
    | 'delete_comment'
    | 'follow'
    | 'unfollow'
    | 'custom_json'
    | 'transfer_to_savings'
    | 'transfer_from_savings'
    | 'escrow_transfer'
    | 'escrow_release'
    | 'escrow_approve'
    | 'escrow_cancel'
    | 'delegate_vesting_shares'
    | 'set_withdraw_vesting_route'
    | 'witness_update'
    | 'create_claimed_account'
    | 'create_proposal'
    | 'update_proposal'
    | 'remove_proposal';

interface FieldDefinition {
    type: 'string' | 'number' | 'boolean'| 'date'; // Define field types
    value: string | number | boolean; // Field value
}

export interface OperationDefinition {
    type: OperationType;
    fields: {
        [key: string]: FieldDefinition; // Use FieldDefinition for each field
    };
}

// List of all operations with their respective fields
export const operations: OperationDefinition[] = [
    {
        type: 'transfer',
        fields: {
            from: { type: 'string', value: '' },
            to: { type: 'string', value: 'futureshock' },
            amount: { type: 'string', value: '0.001 STEEM' }, // Amount could also be of type Asset if needed
            memo: { type: 'string', value: '' },
        },
    },
    {
        type: 'vote',
        fields: {
            voter: { type: 'string', value: '' },
            author: { type: 'string', value: '' },
            permlink: { type: 'string', value: '' },
            weight: { type: 'number', value: 0 }, // Weight is typically a number
        },
    },
    {
        type: 'comment',
        fields: {
            parent_author: { type: 'string', value: 'guest123' },
            parent_permlink: { type: 'string', value: '20230710t182903218z-post' },
            author: { type: 'string', value: authStore.username },
            permlink: { type: 'string', value: 'unique-permlink-' + new Date().getTime() },
            title: { type: 'string', value: '' },
            body: { type: 'string', value: 'This is a test' },
            json_metadata: { type: 'string', value: '' },
        },
    },
    {
        type: 'delete_comment',
        fields: {
            author: { type: 'string', value: '' },
            permlink: { type: 'string', value: '' },
        },
    },
    {
        type: 'follow',
        fields: {
            follower: { type: 'string', value: '' },
            following: { type: 'string', value: '' },
            what: { type: 'string', value: 'blog' }, // The type of follow action
        },
    },
    {
        type: 'unfollow',
        fields: {
            follower: { type: 'string', value: '' },
            following: { type: 'string', value: '' },
        },
    },
    {
        type: 'custom_json',
        fields: {
            requiredAuths: { type: 'string', value: '' }, // Can be array, but let's keep it simple
            id: { type: 'string', value: '' },
            json: { type: 'string', value: '' },
        },
    },
    {
        type: 'transfer_to_savings',
        fields: {
            from: { type: 'string', value: '' },
            to: { type: 'string', value: '' },
            amount: { type: 'string', value: '' },
            memo: { type: 'string', value: '' },
        },
    },
    {
        type: 'transfer_from_savings',
        fields: {
            from: { type: 'string', value: '' },
            to: { type: 'string', value: '' },
            amount: { type: 'string', value: '' },
            memo: { type: 'string', value: '' },
        },
    },
    {
        type: 'escrow_transfer',
        fields: {
            from: { type: 'string', value: '' },
            to: { type: 'string', value: '' },
            agent: { type: 'string', value: '' },
            escrowId: { type: 'number', value: 0 },
            amount: { type: 'string', value: '' },
            fee: { type: 'string', value: '' },
            json: { type: 'string', value: '' },
        },
    },
    {
        type: 'escrow_release',
        fields: {
            from: { type: 'string', value: '' },
            to: { type: 'string', value: '' },
            agent: { type: 'string', value: '' },
            escrowId: { type: 'number', value: 0 },
            memo: { type: 'string', value: '' },
        },
    },
    {
        type: 'escrow_approve',
        fields: {
            from: { type: 'string', value: '' },
            to: { type: 'string', value: '' },
            agent: { type: 'string', value: '' },
            escrowId: { type: 'number', value: 0 },
            approve: { type: 'boolean', value: false }, // Ensure boolean fields are properly typed
        },
    },
    {
        type: 'escrow_cancel',
        fields: {
            from: { type: 'string', value: '' },
            to: { type: 'string', value: '' },
            agent: { type: 'string', value: '' },
            escrowId: { type: 'number', value: 0 },
            memo: { type: 'string', value: '' },
        },
    },
    {
        type: 'delegate_vesting_shares',
        fields: {
            delegator: { type: 'string', value: '' },
            delegatee: { type: 'string', value: '' },
            vestingShares: { type: 'string', value: '' },
        },
    },
    {
        type: 'set_withdraw_vesting_route',
        fields: {
            fromAccount: { type: 'string', value: '' },
            toAccount: { type: 'string', value: '' },
            percent: { type: 'number', value: 0 }, // Withdrawal percent
            autoVest: { type: 'boolean', value: false }, // Auto vesting
        },
    },
    {
        type: 'witness_update',
        fields: {
            owner: { type: 'string', value: '' },
            url: { type: 'string', value: '' },
            blockSigningKey: { type: 'string', value: '' },
            props: { type: 'string', value: '' },
            fee: { type: 'string', value: '' },
        },
    },
    {
        type: 'create_claimed_account',
        fields: {
            creator: { type: 'string', value: '' },
            newAccountName: { type: 'string', value: '' },
            jsonMetadata: { type: 'string', value: '' },
            fee: { type: 'string', value: '' },
        },
    },
    {
        type: 'create_proposal',
        fields: {
            creator: { type: 'string', value: '' },
            receiver: { type: 'string', value: '' },
            startDate: { type: 'string', value: '' },
            endDate: { type: 'string', value: '' },
            dailyPay: { type: 'string', value: '' },
            subject: { type: 'string', value: '' },
            permlink: { type: 'string', value: '' },
        },
    },
    {
        type: 'update_proposal',
        fields: {
            creator: { type: 'string', value: '' },
            proposalId: { type: 'number', value: 0 },
            dailyPay: { type: 'string', value: '' },
            subject: { type: 'string', value: '' },
            permlink: { type: 'string', value: '' },
        },
    },
    {
        type: 'remove_proposal',
        fields: {
            creator: { type: 'string', value: '' },
            proposalId: { type: 'number', value: 0 },
        },
    },
];
