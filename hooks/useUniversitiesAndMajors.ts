import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { DropdownOption, UniversitiesAndMajors } from '@/types/Supabase';

export function useUniversitiesAndMajors(): UniversitiesAndMajors {
  const [universities, setUniversities] = useState<DropdownOption[]>([]);
  const [majors, setMajors] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: uniData } = await supabase.from('universities').select('name');
      const { data: majorData } = await supabase.from('majors').select('fod1p, major');
      setUniversities(
        (uniData || []).map((u: any) => ({ label: u.name, value: u.name }))
      );
      setMajors(
        (majorData || []).map((m: any) => ({ label: m.major, value: m.fod1p }))
      );
      setLoading(false);
    }
    fetchData();
  }, []);

  return { universities, majors, loading };
}
