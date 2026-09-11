'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TaxSummaryCard } from '@/components/ui/TaxSummaryCard';
import { useCartStore } from '@/lib/cart';
import { useAuthStore } from '@/lib/authStore';
import { useAdminStore } from '@/lib/adminStore';
import { submitOrder } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  Lock,
  UserCheck,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';

export default function OrderPage() {
  const { locale, t } = useI18n();
  const { items, updateQuantity, removeItem, clearCart, getFinancials } = useCartStore();
  const financials = getFinancials();

  const currentUser = useAuthStore((state) => state.currentUser);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const loginAsCustomerDemo = useAuthStore((state) => state.loginAsCustomerDemo);
  const loginAsAdminDemo = useAuthStore((state) => state.loginAsAdminDemo);
  const logout = useAuthStore((state) => state.logout);
  const addAdminOrder = useAdminStore((state) => state.addOrder);

  const [guestBypass, setGuestBypass] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '+43 ',
    pickup_time: new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16),
    payment_method: 'cash_on_pickup',
    kitchen_notes: '',
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || currentUser.name,
        customer_email: prev.customer_email || currentUser.email,
        customer_phone:
          prev.customer_phone === '+43 ' || !prev.customer_phone
            ? currentUser.phone
            : prev.customer_phone,
      }));
    }
  }, [currentUser]);

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        is_alcoholic: i.isAlcoholic,
      })),
      total_amount: financials.totalAmount,
      food_gross: financials.foodGross,
      food_net: financials.foodNet,
      food_vat_10: financials.foodVat10,
      drink_gross: financials.drinkGross,
      drink_net: financials.drinkNet,
      drink_vat_20: financials.drinkVat20,
    };

    const generatedOrderNumber = `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Save into live Admin Store so the restaurant manager sees it immediately!
    addAdminOrder({
      order_number: generatedOrderNumber,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      pickup_time: formData.pickup_time,
      payment_method: formData.payment_method as 'cash_on_pickup' | 'stripe_online',
      payment_status: formData.payment_method === 'cash_on_pickup' ? 'pending' : 'paid',
      status: 'new',
      kitchen_notes: formData.kitchen_notes,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        isAlcoholic: i.isAlcoholic,
      })),
      subtotal: financials.subtotal,
      totalVat: financials.totalVat,
      totalAmount: financials.totalAmount,
    });

    try {
      const orderPayload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        pickup_time: new Date(formData.pickup_time).toISOString(),
        payment_method: formData.payment_method,
        kitchen_notes: formData.kitchen_notes,
        items: items.map((i) => ({ menu_item_id: i.id, quantity: i.quantity })),
      };
      const res = await submitOrder(orderPayload);
      if (res && res.order) {
        setSuccessOrder(res.order);
      } else {
        setSuccessOrder({
          order_number: `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          pickup_time: formData.pickup_time,
          payment_method: formData.payment_method,
        });
      }
    } catch {
      setSuccessOrder({
        order_number: `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        pickup_time: formData.pickup_time,
        payment_method: formData.payment_method,
      });
    }

    clearCart();
    setLoading(false);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    if (!currentUser && !guestBypass) {
      e.preventDefault();
      openAuthModal('signin');
      return;
    }
    handleSubmit(e);
  };

  if (successOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FBF0DF] via-stone-50 to-[#F5ECE1] dark:from-[#110D0A] dark:via-[#16120F] dark:to-[#0C0908] py-16 px-4 md:px-8 transition-colors duration-300">
        <div className="container max-w-xl mx-auto text-center space-y-6">
          <div className="w-18 h-18 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-napoli-green flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge variant="napoli" className="bg-napoli-green text-white font-bold">
              Bestellung Bestätigt
            </Badge>
            <h1 className="font-poppins text-3xl font-extrabold text-stone-900 dark:text-white">
              Grazie! Ihre Bestellung ist eingegangen.
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-300">
              Wir heizen den Holzofen bei 485°C an. Ihre Bestellung wird ofenfrisch für Sie zubereitet.
            </p>
          </div>

          <Card className="text-left bg-white dark:bg-[#1A1411] border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4 rounded-3xl">
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-3">
              <span className="text-sm text-stone-500 dark:text-stone-400">
                Bestellnummer:
              </span>
              <span className="font-mono font-bold text-napoli-red dark:text-red-400">
                {successOrder.order_number}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-stone-700 dark:text-stone-300">
              <span className="text-stone-500 dark:text-stone-400">
                Abholort:
              </span>
              <span className="font-semibold text-right">Hauptstraße 44, 2325 Himberg</span>
            </div>
            <div className="flex justify-between items-center text-sm text-stone-700 dark:text-stone-300">
              <span className="text-stone-500 dark:text-stone-400">
                Abholzeit:
              </span>
              <span className="font-semibold">
                {new Date(successOrder.pickup_time).toLocaleTimeString('de-AT', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                Uhr
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-stone-700 dark:text-stone-300">
              <span className="text-stone-500 dark:text-stone-400">
                Zahlungsart:
              </span>
              <span className="font-semibold capitalize">
                {successOrder.payment_method === 'cash_on_pickup'
                  ? 'Bar bei Abholung'
                  : 'Online bezahlt'}
              </span>
            </div>
          </Card>

          <Link href="/">
            <Button className="bg-napoli-red hover:bg-napoli-redDark text-white rounded-xl shadow-md cursor-pointer mt-4">
              Zur Startseite
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF0DF] via-stone-50 to-[#F5ECE1] dark:from-[#110D0A] dark:via-[#16120F] dark:to-[#0C0908] pt-6 pb-16 sm:py-10 md:py-16 px-4 sm:px-6 md:px-8 transition-colors duration-300">
      <div className="container max-w-5xl mx-auto space-y-5 sm:space-y-6">
        
        {/* Navigation Breadcrumb & Page Title */}
        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-napoli-red dark:hover:text-red-400 transition-colors py-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-napoli-red" />
            <span>Zurück zur Speisekarte</span>
          </Link>
          <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Warenkorb &amp; Abholung
          </h1>
        </div>

        {items.length === 0 ? (
          <Card className="text-center p-8 sm:p-12 bg-white dark:bg-[#1A1411] border border-stone-200 dark:border-stone-800 shadow-xl rounded-2xl sm:rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mx-auto mb-2 text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-poppins text-2xl font-bold text-stone-900 dark:text-white">
              Ihr Warenkorb ist leer
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
              Wählen Sie aus unserer Auswahl an original neapolitanischen Pizzen und Spezialitäten.
            </p>
            <Link href="/menu">
              <Button className="bg-napoli-red hover:bg-napoli-redDark text-white rounded-xl shadow-md cursor-pointer mt-2">
                Zur Speisekarte
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <Card className="bg-white dark:bg-[#1A1411] border border-stone-200 dark:border-stone-800 shadow-md sm:shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
                <CardHeader className="p-4 sm:p-6 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <CardTitle className="text-base sm:text-lg font-bold text-stone-900 dark:text-white font-poppins">
                    {locale === 'en'
                      ? `Your Selection (${items.length} items)`
                      : `Ihre Auswahl (${items.length} Positionen)`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-stone-100 dark:divide-stone-800/80 p-4 sm:p-6">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      {/* Top Row: Title, Subtitle, and Remove Button */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-white leading-snug break-words">
                            {item.name}
                          </h4>
                          <span className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 block">
                            {formatEuro(item.unitPrice)} {item.isAlcoholic ? '(20% USt)' : '(10% USt)'}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                          aria-label="Remove item"
                          title={locale === 'en' ? 'Remove' : 'Entfernen'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Row: Quantity Stepper (Left) & Total Price (Right, Locked & Unclipped) */}
                      <div className="mt-3 flex items-center justify-between gap-3 pt-2 border-t border-dashed border-stone-100 dark:border-stone-800/80">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-900 shadow-2xs shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-napoli-red dark:hover:text-red-400 cursor-pointer rounded-l-xl transition-colors active:bg-stone-200 dark:active:bg-stone-800"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-mono text-stone-900 dark:text-stone-100 select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-napoli-red dark:hover:text-red-400 cursor-pointer rounded-r-xl transition-colors active:bg-stone-200 dark:active:bg-stone-800"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Total Price for this item: bold, clear, fully visible */}
                        <div className="text-right shrink-0">
                          <span className="font-poppins font-extrabold text-base sm:text-lg text-napoli-red dark:text-red-400 tracking-tight block">
                            {formatEuro(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Austrian Fiscal Tax Summary Card */}
              <TaxSummaryCard
                foodGross={financials.foodGross}
                foodNet={financials.foodNet}
                foodVat10={financials.foodVat10}
                drinkGross={financials.drinkGross}
                drinkNet={financials.drinkNet}
                drinkVat20={financials.drinkVat20}
                totalVat={financials.totalVat}
                totalAmount={financials.totalAmount}
              />
            </div>

            {/* Customer Details & Pickup Form (Protected by Auth Gate) */}
            <div className="lg:col-span-5">
              {!currentUser && !guestBypass ? (
                <Card className="bg-white dark:bg-[#1A1411] border border-stone-200 dark:border-stone-800 shadow-md sm:shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-7 space-y-5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-napoli-red/10 dark:bg-red-950/40 text-napoli-red dark:text-red-400 flex items-center justify-center mx-auto border border-napoli-red/20 shadow-xs">
                    <Lock className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-poppins text-lg sm:text-xl font-bold text-stone-900 dark:text-white">
                      Anmelden vor Bestellung
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
                      Melden Sie sich an oder erstellen Sie ein kostenloses Konto, um Ihre Bestellung abzuschließen und den Abholstatus zu verfolgen.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <Button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="w-full h-11 bg-napoli-red hover:bg-napoli-redDark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer"
                    >
                      Anmelden
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openAuthModal('signup')}
                      className="w-full h-11 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm rounded-xl cursor-pointer"
                    >
                      Konto registrieren
                    </Button>
                  </div>

                  {/* Fast 1-Click Demo Logins for instant testing */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
                      Schnellzugang für Demo
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={loginAsAdminDemo}
                        className="p-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/30 text-napoli-red dark:text-red-300 text-xs font-bold hover:bg-red-100 cursor-pointer"
                      >
                        Als Admin
                      </button>
                      <button
                        type="button"
                        onClick={loginAsCustomerDemo}
                        className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                      >
                        Als Kunde
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setGuestBypass(true)}
                      className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline font-medium cursor-pointer"
                    >
                      Oder als Gast ohne Konto bestellen →
                    </button>
                  </div>
                </Card>
              ) : (
                <Card className="bg-white dark:bg-[#1A1411] border border-stone-200 dark:border-stone-800 shadow-md sm:shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base sm:text-lg font-bold text-stone-900 dark:text-white font-poppins">
                        Abholinformationen
                      </CardTitle>
                      {currentUser && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <UserCheck className="w-3 h-3" />
                          <span>{currentUser.name.split(' ')[0]}</span>
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-stone-500 dark:text-stone-400 text-xs">
                      Pizzeria Little Napoli, Hauptstraße 44, 2325 Himberg
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl">
                        {error}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label htmlFor="customer_name" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                        Vollständiger Name
                      </Label>
                      <Input
                        id="customer_name"
                        required
                        className="h-11 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded-xl"
                        placeholder="z.B. Maximilian Mustermann"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="customer_email" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                        E-Mail-Adresse
                      </Label>
                      <Input
                        id="customer_email"
                        type="email"
                        required
                        className="h-11 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded-xl"
                        placeholder="ihre.email@example.at"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="customer_phone" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                        Telefonnummer (Österreich)
                      </Label>
                      <Input
                        id="customer_phone"
                        required
                        className="h-11 font-mono bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded-xl"
                        placeholder="+43 676 1234567"
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="pickup_time" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                        Gewünschte Abholzeit
                      </Label>
                      <Input
                        id="pickup_time"
                        type="datetime-local"
                        required
                        className="h-11 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl"
                        value={formData.pickup_time}
                        onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="kitchen_notes" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                        Hinweise an die Küche (Optional)
                      </Label>
                      <Input
                        id="kitchen_notes"
                        className="h-11 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded-xl"
                        placeholder="z.B. Bitte geschnitten einpacken"
                        value={formData.kitchen_notes}
                        onChange={(e) => setFormData({ ...formData, kitchen_notes: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <Label className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                        Zahlungsart
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, payment_method: 'cash_on_pickup' })}
                          className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                            formData.payment_method === 'cash_on_pickup'
                              ? 'border-napoli-red bg-napoli-red/10 text-napoli-red dark:text-red-400 font-bold'
                              : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          Bar bei Abholung
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, payment_method: 'stripe_online' })}
                          className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                            formData.payment_method === 'stripe_online'
                              ? 'border-napoli-red bg-napoli-red/10 text-napoli-red dark:text-red-400 font-bold'
                              : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          Karte / Apple Pay
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-base font-bold bg-gradient-to-r from-napoli-red to-napoli-redDark hover:from-napoli-redDark hover:to-[#7E1218] text-white rounded-xl shadow-lg hover:shadow-xl mt-4 cursor-pointer"
                    >
                      {loading
                        ? 'Bestellung wird übermittelt...'
                        : `Jetzt bestellen (${formatEuro(financials.totalAmount)})`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
