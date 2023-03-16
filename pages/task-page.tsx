import Layout from '../components/Layout'
import { GetStaticProps } from 'next'
import { getAllTasksData } from '../lib/fetch'
import useSWR from 'swr'
import axios from 'axios'
import { TASK } from '../types/Types'

interface STATICPROPS {
  staticTasks: TASK[]
}
// React.FCのジェネリクスには、propsの型を指定する
// 今回は、GetStaticPropsの戻り値の型を指定する

const axiosFetcher = async () => {
  // axiosのレスポンスデータの型はジェネリクスで指定できる
  const result = await axios.get<TASK[]>(
    'https://jsonplaceholder.typicode.com/todos/?_limit=10'
  )
  return result.data
}
const TaskPage: React.FC<STATICPROPS> = ({ staticTasks }) => {
  // staticTasksを初期値として渡すことで、このデータを使って事前に静的なデータが生成される
  // ランタイムでこのコンポーネントがマウントされた際には、クライアントサイドでSWRが実行されて、
  // 最新のデータをサーバーから取得して、最初にレンダリングしていた内容が上書きされる
  const { data: tasks, error } = useSWR('todosFetch', axiosFetcher, {
    fallbackData: staticTasks,
    revalidateOnMount: true,
  })
  if (error) return <span>Error!</span>
  return (
    <Layout title="Todos">
      <p className="text-4xl mb-10">todos page</p>
      <ul>
        {tasks &&
          tasks.map((task) => (
            <li key={task.id}>
              {task.id}
              {': '}
              <span>{task.title}</span>
            </li>
          ))}
      </ul>
    </Layout>
  )
}
export default TaskPage

export const getStaticProps: GetStaticProps = async () => {
  // サーバーサイドで実行される
  const staticTasks = await getAllTasksData()
  return {
    props: { staticTasks },
  }
}
