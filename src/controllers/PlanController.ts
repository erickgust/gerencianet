import PlansRepository from '../repositories/PlansRepository'
import { Request, Response } from 'express'

class PlansController {
  // async createPlan (req: Request, res: Response) {
  //   const { name } = req.body

  //   if (!name) {
  //     return res.status(400).json({ error: 'Name is required' })
  //   }

  //   await PlansRepository.createPlan(name)
  // }

  async getPlans (req: Request, res: Response) {
    const plans = await PlansRepository.getPlans()
    res.json(plans)
  }

  async createSubscriptionBolix (req: Request, res: Response) {
    const { value, customerData, planType } = req.body

    if (!value || !customerData || !planType) {
      console.log(value, customerData, planType)
      return res.status(400).json({ error: 'Missing data' })
    }

    const convertValue = value * 100

    const id = await PlansRepository.getPlanId(planType)
    const subscription = await PlansRepository.createSubscriptionBolix({
      id,
      value: convertValue,
      customerData,
      planType
    })

    console.log(subscription)

    return res.json(subscription)
  }
}

export default new PlansController()
