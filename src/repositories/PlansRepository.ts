import Gerencianet from 'gn-api-sdk-typescript'
import { DateTime } from 'luxon'
import options from '../config'
import slugify from 'slugify'

const gerencianet = Gerencianet(options)

type SubscriptionBolix = {
  id: number
  value: number
  customerData: any
  planType: string
}

class PlansRepository {
  async createPlan (name: string) {
    const body = {
      name,
      repeats: null,
      interval: 1
    }

    gerencianet.createPlan({}, body)
      .then((res: any) => console.log('res', res))
      .catch((_err: any) => console.log('erro'))
  }

  async getPlans () {
    try {
      const response = gerencianet.getPlans({})
      return response
    } catch (err) {
      console.log(err)
    }
  }

  async createSubscriptionBolix ({
    id,
    value,
    customerData,
    planType
  }: SubscriptionBolix) {
    const fiveDays = DateTime.now().plus({ days: 5 }).toISODate()

    const body = {
      items: [{
        name: `${planType} - Mensalidade`,
        value,
        amount: 1
      }]
    }

    const paymentBody = {
      payment: {
        banking_billet: {
          expire_at: fiveDays, // data de expiração do boleto
          customer: {
            name: customerData.name,
            email: customerData.email,
            phone_number: slugify(customerData.phone, { remove: /[()\s-]/g }),
            juridical_person: {
              corporate_name: customerData.companyName,
              cnpj: slugify(customerData.cnpj, { remove: /[/.\s-]/g })
            }
          }
        }
      }
    }

    try {
      const subscription = await gerencianet.createSubscription({ id }, body)
      const paySubscription = await gerencianet.paySubscription({
        id: subscription.subscription_id
      }, paymentBody)

      return paySubscription
    } catch (err) {
      console.log(err)
    }
  }

  async getPlanId (name: string) {
    const planName = {
      COM_GESTAO: 'COM GESTÃO',
      SEM_GESTAO: 'SEM GESTÃO'
    }[name] || 'SEM GESTÃO'

    console.log(planName)

    try {
      const plans = await this.getPlans()
      const plan = plans.find((plan: any) => plan.name === planName)

      return plan.plan_id
    } catch {
      console.log('Deu erro')
    }
  }
}

export default new PlansRepository()
