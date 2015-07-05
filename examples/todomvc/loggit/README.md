Test results for set1:
-------------
Profiling methodology is to do a hard reload, then check 'time in compute'
for each optimizer on the console.  The data set is randomly generated though, so
it's not a repeatable test, just ballpark.  Logging seems to affect these
numbers quite a bit, so there's a test that removes them.

This loads initial_facts_set1 initially, and the 'monkey' in the Debugger adding random actions is set to run for 3sec, adding a random action at 10ms interval.

Output format is: [
  percent of calls using any optimization,
  total calls,
  total time spent in compute method,
  optimizer
]

Raw output:
[100, 827, 234, MemoizingSnapshotOptimizer]
[100, 686, 191, MemoizingSnapshotOptimizer]
[100, 898, 181, MemoizingSnapshotOptimizer]
[100, 738, 181, MemoizingSnapshotOptimizer]
[100, 980, 215, MemoizingSnapshotOptimizer]
[100, 1070, 188, MemoizingSnapshotOptimizer]
[100, 723, 173, MemoizingSnapshotOptimizer]
[65, 777, 999, MemoizingOptimizerV2]
[65, 754, 942, MemoizingOptimizerV2]
[82, 1370, 903, MemoizingOptimizerV2]
[71, 855, 1039, MemoizingOptimizerV2]
[63, 643, 1035, MemoizingOptimizerV2]
[76, 1005, 993, MemoizingOptimizerV2]
[77, 1163, 914, MemoizingOptimizerV2]
[69, 839, 1045, MemoizingOptimizer]
[64, 713, 942, MemoizingOptimizer]
[76, 1065, 986, MemoizingOptimizer]
[71, 902, 1041, MemoizingOptimizer]
[68, 888, 920, MemoizingOptimizer]
[74, 911, 934, MemoizingOptimizer]
[67, 789, 956, MemoizingOptimizer]
[NaN, NaN, 1678, NoopOptimizer]
[NaN, NaN, 1567, NoopOptimizer]
[NaN, NaN, 1485, NoopOptimizer]
[NaN, NaN, 1549, NoopOptimizer]
[NaN, NaN, 1726, NoopOptimizer]
[NaN, NaN, 1605, NoopOptimizer]
[NaN, NaN, 1478, NoopOptimizer]
