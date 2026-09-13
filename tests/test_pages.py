# SPDX-License-Identifier: MIT-0
import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from build_pages import collect_snapshot

DEVICE = {'id': 172350, 'name': 'Example', 'model': 'O-M-1PPSTON-CE'}
NOW = '2026-09-13T12:00:00Z'
OLD = '2026-09-13T10:00:00Z'

def record(**changes):
    return dict({'locationId': 172350, 'model': DEVICE['model'], 'pm02': 0,
                 'timestamp': OLD, 'tvoc': None, 'newField': 123}, **changes)

def failure(_):
    raise OSError('Network unavailable')

class SnapshotTests(unittest.TestCase):
    def test_preserves_zero_null_unknown_fields_and_original_measurement_time(self):
        result = collect_snapshot([DEVICE], fetcher=lambda _: record(), now=NOW)
        row = result['devices'][0]
        self.assertEqual(row['record'], record())
        self.assertEqual(row['fetchedAt'], NOW)
        self.assertFalse(row['retained'])
        self.assertIsNone(row['error'])
        self.assertEqual(result['dataLicense'], 'CC-BY-SA-4.0')

    def test_failed_collection_retains_prior_record_without_changing_collection_time(self):
        previous = collect_snapshot([DEVICE], fetcher=lambda _: record(), now=OLD)
        result = collect_snapshot([DEVICE], previous, failure, NOW)
        row = result['devices'][0]
        self.assertEqual(row['record'], record())
        self.assertEqual(row['fetchedAt'], OLD)
        self.assertTrue(row['retained'])
        self.assertIsNotNone(row['error'])
        self.assertEqual(result['generatedAt'], NOW)

    def test_first_failure_has_no_invented_measurements(self):
        row = collect_snapshot([DEVICE], fetcher=failure, now=NOW)['devices'][0]
        self.assertIsNone(row['record'])
        self.assertIsNone(row['fetchedAt'])
        self.assertFalse(row['retained'])
        self.assertIsNotNone(row['error'])

    def test_wrong_location_or_model_is_never_accepted(self):
        for bad in [record(locationId=99), record(model='unknown')]:
            row = collect_snapshot([DEVICE], fetcher=lambda _: bad, now=NOW)['devices'][0]
            self.assertIsNone(row['record'])
            self.assertIsNotNone(row['error'])

    def test_untrusted_prior_data_requires_matching_identity_and_valid_time(self):
        for bad_record, bad_time in [(record(locationId=99), OLD), (record(), 'bad'), (record(), '2099-01-01T00:00:00Z')]:
            previous = {'schemaVersion': 1, 'devices': [dict(DEVICE, record=bad_record, fetchedAt=bad_time)]}
            row = collect_snapshot([DEVICE], previous, failure, NOW)['devices'][0]
            self.assertIsNone(row['record'])
            self.assertIsNone(row['fetchedAt'])
            self.assertFalse(row['retained'])

if __name__ == '__main__':
    unittest.main()
