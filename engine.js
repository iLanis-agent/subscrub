// SubScrub engine - subscription audit math (no DOM)
(function (root) {
  'use strict';

  // A subscription: {id, name, cost, cycle: 'monthly'|'yearly'|'weekly',
  //                  usesPerMonth (honest estimate), cut: bool (marked in the cut simulator)}

  var CYCLE_MONTHS = { weekly: 52 / 12, monthly: 1, yearly: 1 / 12 };

  function monthlyCost(sub) {
    var m = CYCLE_MONTHS[sub.cycle];
    if (!m) return 0;
    return (Number(sub.cost) || 0) * m;
  }

  function yearlyCost(sub) { return monthlyCost(sub) * 12; }

  // Cost per actual use; Infinity if never used. Yearly/weekly subs still measured per use.
  function costPerUse(sub) {
    var u = Number(sub.usesPerMonth) || 0;
    if (u <= 0) return Infinity;
    return monthlyCost(sub) / u;
  }

  function totals(subs) {
    var m = 0;
    subs.forEach(function (s) { m += monthlyCost(s); });
    return { monthly: Math.round(m * 100) / 100, yearly: Math.round(m * 100 * 12) / 100, count: subs.length };
  }

  // Cut simulator: apply cut flags, return new burn + savings.
  function simulate(subs) {
    var kept = subs.filter(function (s) { return !s.cut; });
    var cut = subs.filter(function (s) { return s.cut; });
    var savedM = 0;
    cut.forEach(function (s) { savedM += monthlyCost(s); });
    var k = totals(kept);
    return {
      newMonthly: k.monthly, newYearly: k.yearly,
      savedMonthly: Math.round(savedM * 100) / 100,
      savedYearly: Math.round(savedM * 100 * 12) / 100,
      cutCount: cut.length
    };
  }

  // Waste score: cost per use, with zero-use subs at the top. Returns subs sorted worst first.
  function rankByWaste(subs) {
    return subs.slice().sort(function (a, b) {
      var ca = costPerUse(a), cb = costPerUse(b);
      if (ca === Infinity && cb === Infinity) return monthlyCost(b) - monthlyCost(a);
      if (ca === Infinity) return -1;
      if (cb === Infinity) return 1;
      return cb - ca;
    });
  }

  // Honest verdict for one sub based on cost per use.
  function verdict(sub) {
    var c = costPerUse(sub);
    if (c === Infinity) return 'dead weight';
    if (c > 5) return 'pricey habit';
    if (c > 1) return 'fair';
    return 'earning its keep';
  }

  var api = { CYCLE_MONTHS: CYCLE_MONTHS, monthlyCost: monthlyCost, yearlyCost: yearlyCost,
    costPerUse: costPerUse, totals: totals, simulate: simulate, rankByWaste: rankByWaste, verdict: verdict };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SubEngine = api;
})(typeof self !== 'undefined' ? self : this);
