import React from 'react'
import moment from 'moment'
import { ListItem, Text } from 'components/core'
import { t } from 'helpers/i18n'
import { formatCurrency } from 'helpers/currency'

export const TransactionListItem = ({ navigation, transaction, ...props }) => (
  <ListItem
    title={transaction.amount > 0 ? t('terms.deposit') : t('terms.withdrawal')}
    subtitle={moment(transaction.createdAt).format('ll')}
    rightContent={<Text.H2 color="infoHeavy">{formatCurrency(transaction.amount)}</Text.H2>}
    chevron
    onPress={() => navigation.navigate('TransactionDetail', { transactionId: transaction.id })}
    {...props} />
)
