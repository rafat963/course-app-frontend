/**
 * ميزة التحميل المسبق الذكي للمسارات (Route Prefetching)
 * تتيح تحميل مكونات الصفحات مسبقاً في الخلفية بمجرد مرور مؤشر الماوس أو أثناء خمول المتصفح
 * مما يجعل التنقل بين الصفحات لحظياً وفورياً بنقرة واحدة (0ms Latency)
 */

let _router = null;
const prefetchedPaths = new Set();

export function setupPrefetch(routerInstance) {
  _router = routerInstance;
}

export function prefetchRoute(path) {
  if (!path || !_router || prefetchedPaths.has(path)) return;
  prefetchedPaths.add(path);

  try {
    const resolved = _router.resolve(path);
    if (resolved && resolved.matched && resolved.matched.length > 0) {
      resolved.matched.forEach((record) => {
        if (record.components) {
          Object.values(record.components).forEach((comp) => {
            if (typeof comp === 'function') {
              // استدعاء دالة التحميل الديناميكي () => import(...) في الخلفية
              try {
                const result = comp();
                if (result && typeof result.catch === 'function') {
                  result.catch(() => {
                    prefetchedPaths.delete(path);
                  });
                }
              } catch {
                prefetchedPaths.delete(path);
              }
            }
          });
        }
      });
    }
  } catch {
    prefetchedPaths.delete(path);
  }
}
