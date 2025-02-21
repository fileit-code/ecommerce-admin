// src/routes/SubscriptionPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Rocket, Info, ShieldCheck, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePayment } from '@/context/PaymentContext'

const PLANS = [
  { 
    id: 'basic',
    label: 'Básico',
    price: '$5.000/mes',
    enabled: true
  },
  {
    id: 'pro',
    label: 'Profesional',
    price: '$10.000/mes',
    enabled: false
  },
  {
    id: 'auto',
    label: 'Piloto Automático',
    price: '$50.000/mes',
    enabled: false
  }
]

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('')
  const navigate = useNavigate()
  
  const { authorize } = usePayment()

  const handleMPConnect = async () => {
     const url = await authorize()
     window.location.href = url;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl space-y-8 m-auto">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Zap className="h-4 w-4" />
            <span className="font-medium">Configuración Rápida</span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight">
            Elige tu Plan
          </h1>
          
          <p className="text-muted-foreground">
            Selecciona tu plan preferido y conecta tu método de pagos para comenzar
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-6 space-y-6">
          {/* Plan Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Paso 1: Selección de Plan
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground"
              >
                <Info className="h-4 w-4 mr-2" />
                Comparar planes
              </Button>
            </div>

            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecciona un plan..." />
              </SelectTrigger>
              <SelectContent>
                {PLANS.map((plan) => (
                  <SelectItem 
                    key={plan.id}
                    value={plan.id}
                    disabled={!plan.enabled}
                    className="flex justify-between"
                  >
                    <span>{plan.label}</span>
                    <span className="text-muted-foreground">{plan.price}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Connect Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Paso 2: Conexión de Pagos
            </h2>
            
            <Button
              className={`w-full transition-colors ${
                selectedPlan 
                  ? 'bg-[#00a1ea] hover:bg-[#0092d3]' 
                  : 'bg-muted text-muted-foreground'
              }`}
              disabled={!selectedPlan}
              onClick={handleMPConnect}
            >
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Conectar con Mercado Pago
                <img 
                  src="/mp-logo.png" 
                  alt="Mercado Pago" 
                  className="h-4 ml-2 filter brightness-0 invert"
                />
              </div>
            </Button>
            
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 mt-0.5 text-primary" />
              <span>
                Conexión segura mediante la API oficial de Mercado Pago. 
                No almacenamos tus credenciales de acceso.
              </span>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="text-lg font-medium">Sin Costo Inicial</div>
            <div className="text-sm text-muted-foreground">Sin tarifas ocultas</div>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="text-lg font-medium">Cancelación Fácil</div>
            <div className="text-sm text-muted-foreground">En cualquier momento</div>
          </div>
        </div>
      </div>
    </div>
  )
}